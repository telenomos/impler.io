import { Group, Stack, Avatar, Text, Select } from '@mantine/core';
import { Table } from '@ui/table';
import { AppLayout } from '@layouts/AppLayout';
import { ExitIcon } from '@assets/icons/Exit.icon';

import { MEMBER_ROLE } from '@config';

interface User {
  name: string;
  email: string;
}

interface Member {
  _id?: string;
  user: User;
  joinedDate: string;
  role: string;
  action: string;
}

const membersData: Member[] = [
  {
    user: {
      name: 'John Doe',
      email: 'john@example.com',
    },
    joinedDate: '2023-01-01',
    role: 'Admin',
    action: 'Edit',
  },
  {
    user: {
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
    joinedDate: '2023-02-15',
    role: 'Admin',
    action: 'Edit',
  },
  {
    user: {
      name: 'Bob Johnson',
      email: 'bob@example.com',
    },
    joinedDate: '2023-03-10',
    role: 'Tech',
    action: 'Edit',
  },
  {
    user: {
      name: 'Alice Williams',
      email: 'alice@example.com',
    },
    joinedDate: '2023-04-22',
    role: 'Finance',
    action: 'Edit',
  },
];

export function Members() {
  return (
    <Stack spacing="xs">
      <Stack spacing="sm">
        <Table<Member>
          headings={[
            {
              title: 'User',
              key: 'user',
              Cell: (member: Member) => (
                <Group spacing="sm">
                  <Avatar style={{ border: '1px solid white', borderRadius: 0 }} size="md" />
                  <div>
                    <Text>{member.user.name}</Text>
                    <Text size="xs" color="dimmed">
                      {member.user.email}
                    </Text>
                  </div>
                </Group>
              ),
            },
            {
              title: 'Joined Date',
              key: 'joinedDate',
            },
            {
              title: 'Role',
              key: 'role',
              Cell: (member: Member) => (
                <Select
                  data={MEMBER_ROLE}
                  maw={125}
                  value={member.role}
                  onChange={(value) => {
                    alert(value);
                  }}
                />
              ),
            },
            {
              title: 'Actions',
              key: 'action',
              Cell: () => <ExitIcon style={{ fontWeight: 'bolder' }} size="xl" />,
            },
          ]}
          data={membersData}
        />
      </Stack>
    </Stack>
  );
}

Members.Layout = AppLayout;