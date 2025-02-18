import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquare, Upload, Users } from "lucide-react";

interface Activity {
  id: string;
  type: "comment" | "upload" | "team" | "document";
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  project: string;
}

interface ActivityFeedProps {
  activities?: Activity[];
}

const defaultActivities: Activity[] = [
  {
    id: "1",
    type: "comment",
    user: {
      name: "Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    content: "Added comments on the foundation plans",
    timestamp: "10 minutes ago",
    project: "Downtown Complex",
  },
  {
    id: "2",
    type: "upload",
    user: {
      name: "Mike Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    },
    content: "Uploaded revised structural drawings",
    timestamp: "1 hour ago",
    project: "City Center Mall",
  },
  {
    id: "3",
    type: "team",
    user: {
      name: "Lisa Wong",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    },
    content: "Added 3 new team members to",
    timestamp: "2 hours ago",
    project: "Riverside Apartments",
  },
  {
    id: "4",
    type: "document",
    user: {
      name: "John Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    content: "Updated permit documentation for",
    timestamp: "3 hours ago",
    project: "Harbor Bridge",
  },
];

const ActivityIcon = ({ type }: { type: Activity["type"] }) => {
  const icons = {
    comment: <MessageSquare className="h-4 w-4 text-blue-500" />,
    upload: <Upload className="h-4 w-4 text-green-500" />,
    team: <Users className="h-4 w-4 text-purple-500" />,
    document: <FileText className="h-4 w-4 text-orange-500" />,
  };

  return icons[type];
};

const ActivityFeed = ({
  activities = defaultActivities,
}: ActivityFeedProps) => {
  return (
    <div className="w-full h-full bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Activity Feed</h2>
        <Badge variant="secondary" className="text-sm">
          {activities.length} updates
        </Badge>
      </div>

      <ScrollArea className="h-[calc(100%-2rem)]">
        <div className="space-y-4">
          {activities.map((activity) => (
            <React.Fragment key={activity.id}>
              <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8">
                  <img
                    src={activity.user.avatar}
                    alt={activity.user.name}
                    className="h-full w-full"
                  />
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <ActivityIcon type={activity.type} />
                    <p className="text-sm font-medium text-gray-900">
                      {activity.user.name}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {activity.content}{" "}
                    <span className="font-medium text-gray-900">
                      {activity.project}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
              <Separator className="my-4" />
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ActivityFeed;
