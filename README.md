# Github Actions Id Sample

これみてやってみた。  
https://dev.classmethod.jp/articles/github-actions-without-permanent-credential/

CDK で書いてます。

## これはなに？

GitHub Actions にて、secret に IAM User の access key を仕込まなくても、aws api の呼び出しができます。

## できた？

できた  
https://github.com/yamatatsu/github-actions-id-sample/runs/3619542219?check_suite_focus=true

## 解説

[これ](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_providers_oidc.html)。

AWS IAM は OIDC のアイデンティティに Role を紐付けることができる。これにより、OIDC の token を使って AWS の API が叩ける。
