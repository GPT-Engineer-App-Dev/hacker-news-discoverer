import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fetchStoryDetails = async (id) => {
  const response = await fetch(`https://hn.algolia.com/api/v1/items/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch story details");
  }
  return response.json();
};

const Comment = ({ comment }) => (
  <Card className="mb-4 border-red-200 bg-red-50">
    <CardContent className="pt-4">
      <p className="text-sm text-red-800 mb-2" dangerouslySetInnerHTML={{ __html: comment.text }} />
      <p className="text-xs text-red-600">By: {comment.author}</p>
      {comment.children && (
        <div className="ml-4 mt-2">
          {comment.children.map((childComment) => (
            <Comment key={childComment.id} comment={childComment} />
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

const StoryPage = () => {
  const { id } = useParams();
  const { data: story, isLoading, error } = useQuery({
    queryKey: ["story", id],
    queryFn: () => fetchStoryDetails(id),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 bg-red-100 min-h-screen">
        <Skeleton className="h-8 w-3/4 mb-4 bg-red-200" />
        <Skeleton className="h-4 w-1/2 mb-2 bg-red-200" />
        <Skeleton className="h-4 w-1/4 mb-4 bg-red-200" />
        <Skeleton className="h-32 w-full mb-4 bg-red-200" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-700">Error: {error.message}</p>;
  }

  return (
    <div className="container mx-auto py-8 bg-red-100 min-h-screen">
      <Link to="/">
        <Button className="mb-4 bg-red-600 hover:bg-red-700 text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stories
        </Button>
      </Link>
      <Card className="mb-8 border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-800">{story.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700 mb-2">By: {story.author}</p>
          <p className="text-red-600 mb-4">Points: {story.points}</p>
          <Button
            variant="link"
            className="p-0 text-red-700 hover:text-red-900"
            onClick={() => window.open(story.url, "_blank")}
          >
            Read full story
          </Button>
        </CardContent>
      </Card>
      <h2 className="text-xl font-semibold mb-4 text-red-800">Comments</h2>
      {story.children && story.children.length > 0 ? (
        story.children.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))
      ) : (
        <p className="text-red-700">No comments yet.</p>
      )}
    </div>
  );
};

export default StoryPage;