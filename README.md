# Installation

### Assumptions

This guide makes several assumptions.

1. That you're using this Serverless application in conjunction with <a href="https://www.technicalpursuit.com">TIBET</a>

2. This is a NodeJS project.

### Steps

#### Clone this project

```sh
git clone http://github.com/TechnicalPursuit/aws-passthrough-tibet
```


#### Install AWS CLI

If you haven't done so, install the AWS CLI.

Mac OS X instructions using Brew:

```sh
brew install awscli
```

For other OS platforms or packaging systems, refer to their documentation.


#### Install the Serverless framework globally

```sh
npm install serverless -g
```


#### Set up serverless IAM credentials per the serverless web page

<a href="https://serverless.com/framework/docs/providers/aws/guide/credentials/">AWS - Credentials</a>


#### Install those credentials in your project.

For development purposes, we recommend using the `serverless config credentials` command:

```sh
serverless config credentials --provider aws --key <<your_key>> --secret <<your_secret>>
```

If you already have credentials in your `~/.aws/credentials` file, we recommend
adding another profile with your development keys in it:

```sh
[development]
aws_access_key_id = <<your_key>>
aws_secret_access_key = <<your_secret>>
```

and then exporting the name of the profile:

```sh
export AWS_PROFILE="development"
```

#### Deploy the TIBET AWS Passthrough configuration and code into AWS:

Note that the `--verbose` setting here is required to see output values that you will need below to properly configure your TIBET application.

```sh
serverless deploy --stage test --verbose
```

This will output 3 values:

- The user pool ID
- The user pool client (also called 'app') ID
- The identity pool ID

#### Using the 'user pool client' (also called 'app') ID that was logged out, set up a user:

```sh
aws cognito-idp sign-up \
  --region <<your_cognito_region>> \
  --client-id <<your_user_pool_client_id>> \
  --username admin@example.com \
  --password Passw0rd! \
  --user-attributes Name=email,Value=admin@example.com
```

#### Verify the user using the 'user pool ID' (NOT 'user pool client ID'):

```sh
aws cognito-idp admin-confirm-sign-up \
  --region <<your_cognito_region>> \
  --user-pool-id <<your_user_pool_id>> \
  --username admin@example.com
```

#### Over in your TIBET application, configure the following AWS Passthrough configuration parameters using the values that were logged out above.
```sh
    aws.passthrough.userPoolID
    aws.passthrough.appID
    aws.passthrough.identityPoolID
```

You can add these directly to the project's `tibet.json` file:

`<yourproject>/public/tibet.json`:

```sh
{
    "NOTE" : "TIBET project file. Set configuration parameters here.",
    "project": {
        "name": "myproject"
    },
    "tibet": {
        "dna": "default"
    },
    "boot": {
        "use_login": false
    },
    "aws": {
        "passthrough": {
            "userPoolID": <<your_user_pool_id>>,
            "appID": <<your_user_pool_client_id>>,
            "identityPoolID": <<your_identity_pool_id>>
        }
    }
}
```

You can also configure these by executing the following commands **inside of the TIBET project**:

```sh
tibet config aws.passthrough.userPoolID=<<your_user_pool_id>>
tibet config aws.passthrough.appID=<<your_user_pool_client_id>>
tibet config aws.passthrough.identityPoolID=<<your_identity_pool_id>>
```

Note that TIBET also allows you to configure the following 2 values, although
they have defaults:

```sh
    aws.passthrough.region (default is: 'us-east-1');
    aws.passthrough.apiVersion (default is: '2015-03-31');
```

#### Run your TIBET project with the Sherpa enabled

#### Use the Sherpa Inspector to navigate to the Amazon remote service

1. Go into the Sherpa Inspector
2. Click `REST` > `AWS` > `S3`
3. Log in using the user **that you added to the user pool above** using the AWS
   CLI tools.

#### Browse to your resources.
