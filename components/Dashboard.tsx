import React, { useState } from "react";
import {
  Box,
  Button, DropZone,
  H2,
  H5, Icon,
  Illustration,
  Text
} from "@adminjs/design-system";

import { useTranslation } from 'adminjs';
import axios from "axios";
import CouponIssueSection from "./CouponIssueSection.js";
import Card from "./Card.js";

const pageHeaderHeight = 284;
const pageHeaderPaddingY = 74;
const pageHeaderPaddingX = 250;

export const DashboardHeader: React.FC = () => {
  const { translateMessage } = useTranslation();
  return (
    <Box position="relative" overflow="hidden" data-css="default-dashboard">
      <Box
        position="absolute"
        top={50}
        left={-10}
        opacity={[0.2, 0.4, 1]}
        animate
      >
        <Illustration variant="Rocket" />
      </Box>
      <Box
        position="absolute"
        top={-70}
        right={-15}
        opacity={[0.2, 0.4, 1]}
        animate
      >
        <Illustration variant="Moon" />
      </Box>
      <Box
        bg="grey100"
        height={pageHeaderHeight}
        py={pageHeaderPaddingY}
        px={['default', 'lg', pageHeaderPaddingX]}
      >
        <Text textAlign="center" color="white">
          <H2>{translateMessage('welcomeOnBoard_title')}</H2>
          <Text opacity={0.8}>
            {translateMessage('welcomeOnBoard_subtitle')}
          </Text>
        </Text>
      </Box>
    </Box>
  );
};


export const Dashboard: React.FC = (props) => {
  console.log('dashboard props', props);
  const { translateMessage, translateButton } = useTranslation();
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [themeFiles, setThemeFiles] = useState<File[]>([])
  const [styleFiles, setStyleFiles] = useState<File[]>([])

  const uploadImageFiles = (scaleSize: '1x' | '2x') => async (files: File[]) => {
    setImageFiles(files);
    try {
      const formData = new FormData();
      formData.append('scaleSize', scaleSize);
      files.forEach((file) => {
        formData.append('file', file);
      })
      await axios.post('/api/s3/collectionImages', formData)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response.data);
      }
      console.error(err);
    }
    setImageFiles([]);
  }

  const uploadThemeFiles = async (files: File[]) => {
    setThemeFiles(files);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('file', file);
      })
      const res = await axios.post<string[]>('/api/s3/collectionThemes', formData)
      if (res.data.length) {
        alert('중복: ' + res.data.join(', '))
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(err.response.data);
      }
      console.error(err);
    }
    setThemeFiles([]);
  }

  const uploadStyleFiles = async (files: File[]) => {
    setStyleFiles(files);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('file', file);
      })
      const res = await axios.post<string[]>('/api/s3/collectionStyles', formData)
      if (res.data.length) {
        alert('중복: ' + res.data.join(', '))
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(err.response.data);
      }
      console.error(err);
    }
    setStyleFiles([]);
  }

  return (
    <Box>
      <DashboardHeader />
      <Box
        mt={['xl', 'xl', '-100px']}
        mb="xl"
        mx={[0, 0, 0, 'auto']}
        px={['default', 'lg', 'xxl', '0']}
        position="relative"
        flex
        flexDirection="row"
        flexWrap="wrap"
        width={[1, 1, 1, 1024]}
      >
        <Box width={[1, 1 / 2, 1 / 2, 1 / 4]} p="lg">
          <Card as="a">
            <Text textAlign="center">
              <Icon icon="Image" />
              <H5 mt="lg">{translateMessage('uploadCollectionImages1x')}</H5>
              <Text>{translateMessage('uploadCollectionImages1x_detail')}</Text>
              <DropZone
                files={imageFiles}
                multiple
                translations={{
                  placeholder: '클릭하거나 파일을 드롭하세요',
                }}
                onChange={uploadImageFiles('1x')}
              />
            </Text>
          </Card>
        </Box>
        <Box width={[1, 1 / 2, 1 / 2, 1 / 4]} p="lg">
          <Card as="a">
            <Text textAlign="center">
              <Icon icon="Image" />
              <H5 mt="lg">{translateMessage('uploadCollectionImages2x')}</H5>
              <Text>{translateMessage('uploadCollectionImages2x_detail')}</Text>
              <DropZone
                files={imageFiles}
                multiple
                translations={{
                  placeholder: '클릭하거나 파일을 드롭하세요',
                }}
                onChange={uploadImageFiles('2x')}
              />
            </Text>
          </Card>
        </Box>
        <Box width={[1, 1 / 2, 1 / 2, 1 / 4]} p="lg">
          <Card as="a">
            <Text textAlign="center">
              <Icon icon="Image" />
              <H5 mt="lg">{translateMessage('uploadCollectionTheme')}</H5>
              <Text>{translateMessage('uploadCollectionTheme_detail')}</Text>
              <DropZone
                  files={themeFiles}
                  multiple
                  translations={{
                    placeholder: '클릭하거나 파일을 드롭하세요',
                  }}
                  onChange={uploadThemeFiles}
              />
            </Text>
          </Card>
        </Box>
        <Box width={[1, 1 / 2, 1 / 2, 1 / 4]} p="lg">
          <Card as="a">
            <Text textAlign="center">
              <Icon icon="Image" />
              <H5 mt="lg">{translateMessage('uploadCollectionStyle')}</H5>
              <Text>{translateMessage('uploadCollectionStyle_detail')}</Text>
              <DropZone
                files={styleFiles}
                multiple
                translations={{
                  placeholder: '클릭하거나 파일을 드롭하세요',
                }}
                onChange={uploadStyleFiles}
              />
            </Text>
          </Card>
        </Box>
        <CouponIssueSection />
        <Box width={[1, 1, 1 / 2]} p="lg">
          <Card
            as="a"
            flex
            href="https://smoretalk-io.slack.com/ssb/redirect"
            target="_blank"
          >
            <Box flexShrink={0}>
              <Illustration variant="SlackLogo" />
            </Box>
            <Box ml="xl">
              <H5>{translateMessage('community_title')}</H5>
              <Text>{translateMessage('community_subtitle')}</Text>
            </Box>
          </Card>
        </Box>
        <Box width={[1, 1, 1 / 2]} p="lg">
          <Card
            as="a"
            flex
            href="https://github.com/smoretalk/alchemist-back/issues"
            target="_blank"
          >
            <Box flexShrink={0}>
              <Illustration variant="GithubLogo" />
            </Box>
            <Box ml="xl">
              <H5>{translateMessage('foundBug_title')}</H5>
              <Text>{translateMessage('foundBug_subtitle')}</Text>
            </Box>
          </Card>
        </Box>
        <Card width={1} m="lg">
          <Text textAlign="center">
            <Illustration variant="AdminJSLogo" />
            <H5>{translateMessage('needMoreSolutions_title')}</H5>
            <Text>{translateMessage('needMoreSolutions_subtitle')}</Text>
            <Text mt="xxl">
              <Button
                as="a"
                variant="contained"
                href="https://share.hsforms.com/1IedvmEz6RH2orhcL6g2UHA8oc5a"
                target="_blank"
              >
                {translateButton('contactUs')}
              </Button>
            </Text>
          </Text>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
