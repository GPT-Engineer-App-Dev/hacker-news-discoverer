import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fetchTopStories = async () => {
  const response = await fetch(
    "https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch stories");
  }
  return response.json();
};

const StoryCard = ({ story }) => (
  <Card className="mb-4 border-red-200 bg-red-50">
    <CardHeader>
      <CardTitle className="text-lg font-semibold text-red-800">{story.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-red-600 mb-2">Upvotes: {story.points}</p>
      <Button
        variant="link"
        className="p-0 text-red-700 hover:text-red-900"
        onClick={() => window.open(story.url, "_blank")}
      >
        Read more
      </Button>
    </CardContent>
  </Card>
);

const SkeletonCard = () => (
  <Card className="mb-4 border-red-200 bg-red-50">
    <CardHeader>
      <Skeleton className="h-6 w-3/4 bg-red-200" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-1/4 mb-2 bg-red-200" />
      <Skeleton className="h-4 w-1/6 bg-red-200" />
    </CardContent>
  </Card>
);

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });

  const filteredStories = data?.hits.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 bg-red-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-red-900">Top 100 Hacker News Stories</h1>
      <div className="mb-6 flex">
        <Input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mr-2 border-red-300 focus:ring-red-500 focus:border-red-500"
        />
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
      {isLoading && (
        <div>
          {[...Array(10)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}
      {error && <p className="text-red-700">Error: {error.message}</p>}
      {filteredStories && (
        <div>
          {filteredStories.map((story) => (
            <StoryCard key={story.objectID} story={story} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;