import {
  App,
  Stack,
  StackProps,
  aws_iam,
  aws_lambda_nodejs,
} from "aws-cdk-lib";

const REPO_NAME = "yamatatsu/github-actions-id-sample";

class MyStack extends Stack {
  constructor(parent: App, id: string, props?: StackProps) {
    super(parent, id, props);

    // とある実験用Lambdaを作成。これをaccess keyを使わずにGHAから呼び出すのがゴールです。
    const lambdaFn = new aws_lambda_nodejs.NodejsFunction(this, "Function", {
      entry: "./lambda.ts",
    });

    // IdPの定義
    const oidcProvider = new aws_iam.OpenIdConnectProvider(
      this,
      "OIDCProvider",
      {
        // 以下の３つはAWSアカウント、GitHubリポジトリに依らず固定値
        url: "https://token.actions.githubusercontent.com",
        clientIds: ["sigstore"],
        thumbprints: ["a031c46782e6e6c662c2c87c76da9aa62ccabd8e"],
      }
    );

    // IdP を AssumeRolePolicyDocument に設定した Role を作成する
    const role = new aws_iam.Role(this, "Role", {
      roleName: "ExampleGithubRole",
      assumedBy: new aws_iam.FederatedPrincipal(
        oidcProvider.openIdConnectProviderArn,
        {
          StringLike: {
            "vstoken.actions.githubusercontent.com:sub": `repo:${REPO_NAME}:*`,
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
      managedPolicies: [
        // GitHub token id でcdkコマンドが動くかを試してみるために付与
        aws_iam.ManagedPolicy.fromAwsManagedPolicyName(
          "AWSCloudFormationReadOnlyAccess"
        ),
      ],
    });

    // Role に実験用Lambdaを実行する権限を付与
    lambdaFn.grantInvoke(role);
  }
}

const app = new App();
new MyStack(app, "github-actions-id-sample");
