# Github Actions Id Sample

これみてやってみた。  
https://dev.classmethod.jp/articles/github-actions-without-permanent-credential/

CDK で書いてます。

## これはなに？

GitHub Actions にて、secret に IAM User の access key を仕込まなくても、aws api の呼び出しができます。

AWS CDK も（Role にちゃんと権限つければ）動きます。

## できた？

できた  
https://github.com/yamatatsu/github-actions-id-sample/runs/3628343114?check_suite_focus=true

## 解説

[これ](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_providers_oidc.html)。

AWS IAM は OIDC のアイデンティティに Role を紐付けることができる。

このたび、GitHub Actions 内で固有の OIDC の JWT token が手に入るようになった。この token を使って AWS の API が叩ける。

これで GitHub Secrets に access key を置かなくても良くなった。最高かよ。
