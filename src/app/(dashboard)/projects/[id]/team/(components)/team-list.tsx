import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  company: string;
}

interface TeamListProps {
  members: TeamMember[];
}

export function TeamList({ members }: TeamListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Company</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="font-medium">{member.name}</TableCell>
            <TableCell>{member.role}</TableCell>
            <TableCell>{member.email}</TableCell>
            <TableCell>{member.company}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 