import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Dummy data for users
const users = [
  {
    id: "1",
    name: "Alex Doe",
    email: "alex.doe@innovate.edu",
    role: "User",
    status: "Active",
    lastLogin: "2024-07-28",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "User",
    status: "Active",
    lastLogin: "2024-07-27",
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-07-28",
  },
  {
    id: "4",
    name: "Inactive User",
    email: "inactive@example.com",
    role: "User",
    status: "Inactive",
    lastLogin: "2024-05-12",
  },
];

export default function UsersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>View and manage all registered users.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                   <Badge variant={user.status === 'Active' ? 'outline' : 'destructive'} className={user.status === 'Active' ? 'text-green-500 border-green-500' : ''}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>{user.lastLogin}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
