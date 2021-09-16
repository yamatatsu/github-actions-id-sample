import {
  App,
  Stack,
  StackProps,
  aws_iam,
  aws_lambda_nodejs,
} from "aws-cdk-lib";

const REPO_NAME = "github-actions-id-sample";

class MyStack extends Stack {
  constructor(parent: App, id: string, props?: StackProps) {
    super(parent, id, props);

    const lambdaFn = new aws_lambda_nodejs.NodejsFunction(this, "Function", {
      entry: "./lambda.ts",
    });

    const oidcProvider = new aws_iam.OpenIdConnectProvider(
      this,
      "OIDCProvider",
      {
        // 以下の３つはAWSアカウント、GitHubリポジトリに依らず固定値
        url: "https://vstoken.actions.githubusercontent.com",
        clientIds: ["sigstore"],
        thumbprints: ["a031c46782e6e6c662c2c87c76da9aa62ccabd8e"],
      }
    );

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
    });

    lambdaFn.grantInvoke(role);
  }
}

const app = new App();
new MyStack(app, "MyStack", {
  stackName: "MyStack",
});
