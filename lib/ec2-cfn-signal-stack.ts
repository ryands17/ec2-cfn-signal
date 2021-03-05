import * as cdk from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as iam from '@aws-cdk/aws-iam'

export class Ec2CfnSignalStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // Create a VPC to deploy the instance to
    const vpc = new ec2.Vpc(this, 'signalVPC', {
      maxAzs: 1,
      cidr: '192.168.0.0/24',
      subnetConfiguration: [
        { name: 'public', subnetType: ec2.SubnetType.PUBLIC, cidrMask: 25 },
      ],
      natGateways: 0,
      enableDnsHostnames: true,
      enableDnsSupport: true,
    })

    // The Ubuntu EC2 instance
    const instance = new ec2.Instance(this, 'signalTest', {
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux(),
      init: ec2.CloudFormationInit.fromElements(
        ec2.InitPackage.yum('gcc'),
        ec2.InitPackage.yum('gcc-c++'),
        ec2.InitPackage.yum('make'),
        ec2.InitCommand.shellCommand(
          'curl -fsSL https://rpm.nodesource.com/setup_14.x | bash -'
        ),
        ec2.InitCommand.shellCommand('yum install -y nodejs')
      ),
      initOptions: { timeout: cdk.Duration.minutes(5) },
      userDataCausesReplacement: true,
    })

    // Add the policy to access EC2 without SSH
    instance.role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore')
    )
  }
}
