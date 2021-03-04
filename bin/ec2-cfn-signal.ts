#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Ec2CfnSignalStack } from '../lib/ec2-cfn-signal-stack';

const app = new cdk.App();
new Ec2CfnSignalStack(app, 'Ec2CfnSignalStack');
