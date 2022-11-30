import React from 'react';
import { Text, Flex } from '@contentful/f36-components';
import tokens from "@contentful/f36-tokens";
import { HomeExtensionSDK } from '@contentful/app-sdk';
import {  useSDK } from '@contentful/react-apps-toolkit';
import Entries from '../components/Entries';
import Authors from '../components/Authors';

const Home = () => {
  const sdk = useSDK<HomeExtensionSDK>();

  return (
    <Flex 
      flexDirection="column" 
      alignItems="center" 
      fullWidth
    >
      <Flex
        justifyContent="center"
        padding="spacing3Xl"
        fullWidth
        style={{ backgroundColor: tokens.gray700 }}
      >
        <Flex flexDirection="column" gap="spacingXl" style={{ width: "900px" }}>
          <Text
            fontColor="colorWhite"
            fontSize="fontSize4Xl"
            fontWeight="fontWeightDemiBold"
          >
            👋 Welcome back, {sdk.user.firstName}!
          </Text>
        </Flex>
      </Flex>
      <Flex
        style={{ width: "900px" }}
        flexDirection="row"
        marginTop="spacing3Xl"
      >
          <Entries />
          <Authors />
      </Flex>
    </Flex>
  );
};

export default Home;
