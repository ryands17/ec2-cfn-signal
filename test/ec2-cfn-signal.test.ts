import {
  expect as expectCDK,
  haveResourceLike,
  SynthUtils,
} from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import * as Ec2CfnSignal from '../lib/ec2-cfn-signal-stack'

test('Snapshot matches the resources correctly', () => {
  const stack = createStack()
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot()
})

test('VPC and public subnet is created', () => {
  const stack = createStack()

  expectCDK(stack).to(
    haveResourceLike('AWS::EC2::VPC', {
      CidrBlock: '192.168.0.0/24',
      EnableDnsHostnames: true,
      EnableDnsSupport: true,
      InstanceTenancy: 'default',
      Tags: [],
    })
  )

  expectCDK(stack).to(
    haveResourceLike('AWS::EC2::Subnet', {
      CidrBlock: '192.168.0.0/25',
      VpcId: {},
      AvailabilityZone: {},
      MapPublicIpOnLaunch: true,
      Tags: [],
    })
  )
})

test('EC2 instance is created with the correct properties', () => {
  const stack = createStack()

  expectCDK(stack).to(
    haveResourceLike('AWS::EC2::Instance', {
      AvailabilityZone: {},
      IamInstanceProfile: {},
      ImageId: {},
      InstanceType: 't2.micro',
      SecurityGroupIds: [],
      SubnetId: {},
      Tags: [],
      UserData: {
        'Fn::Base64': {},
      },
    })
  )
})

function createStack() {
  const app = new cdk.App()
  return new Ec2CfnSignal.Ec2CfnSignalStack(app, 'MyTestStack')
}
