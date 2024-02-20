"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Card,
  Center,
  Flex,
  Grid,
  Group,
  Image,
  Text
} from '@mantine/core';
import {
  IconAt,
  IconPhoneCall,
  IconStar,
  IconTrash,
  IconUserMinus,
  IconUserPlus,
  IconWorld
} from '@tabler/icons-react';

function HomePage() {
  const [user, setUser] = useState([]);
  const [followStatus, setFollowStatus] = useState({});

  const handleToggleFollow = (userId) => {
    setFollowStatus((prevStatus) => ({
      ...prevStatus,
      [userId]: !prevStatus[userId],
    }));
  };

  const fetchAvatarUrl = async (username) => {
    const response = await fetch(`https://api.dicebear.com/7.x/initials/svg?seed=${username}`);
    return response.url;
  };

  const fetchUsers = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    setUser(await response.json());
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchAvatars = async () => {
      const updatedUser = await Promise.all(
        user.map(async (userData) => {
          const avatarUrl = await fetchAvatarUrl(userData?.name);
          return { ...userData, avatarUrl };
        })
      );
      setUser(updatedUser);
    };

    fetchAvatars();
  }, [user]);

  const onDelete = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUser((prevUser) => prevUser.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error', error);
    }
  };

  return (
    <div>
      <Flex wrap="wrap" gap="md" justify="flex-start" m={20}>
        {user.map((userData) => (
          <Grid key={userData.id} gutter={{ base: 10, xs: 5, md: 'xl', xl: 50 }} style={{ width: '24%' }}>
            <Grid.Col span={{ base: 12, md: 12, lg: 12, sm: 12 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Center>
                  <Image
                    radius="50%"
                    w="120px"
                    h="120px"
                    fit="contain"
                    src={userData.avatarUrl}
                    alt="user-images"
                  />
                </Center>
                <Text size="lg" align="center" mt={20} fw={500}>
                  {userData.name}
                  {followStatus[userData.id] && <IconStar color="#000" size={16} />}
                </Text>
                <Text size="md" c="dimmed" mt={5}>
                  <IconAt color="gray" size={16} /> {userData.email}
                </Text>
                <Text size="md" c="dimmed" mt={5}>
                  <IconPhoneCall color="gray" size={16} /> {userData.phone}
                </Text>
                <Text size="md" c="dimmed" mt={5}>
                  <IconWorld color="gray" size={16} /> {userData.website}
                </Text>
                <Group justify="center">
                  {followStatus[userData.id] ? (
                    <Button
                      variant="default"
                      mt={15}
                      onClick={() => handleToggleFollow(userData.id)}
                      leftSection={<IconUserMinus color="#000" size={16} />}
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      variant="filled"
                      mt={15}
                      onClick={() => handleToggleFollow(userData.id)}
                      leftSection={<IconUserPlus color="#fff" size={16} />}
                    >
                      Follow
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    mt={15}
                    onClick={() => onDelete(userData.id)}
                    leftSection={<IconTrash color="#228be6" size={16} />}
                  >
                    Delete
                  </Button>
                </Group>
              </Card>
            </Grid.Col>
          </Grid>
        ))}
      </Flex>
    </div>
  );
}

export default HomePage;
