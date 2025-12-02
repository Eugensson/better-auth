import { GetStartedButton } from "@/components/get-started-button";

const Home = () => {
  return (
    <div className="h-dvh flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-8">
        <h1 className="text-6xl font-bold">Better Auth</h1>
        <GetStartedButton />
      </div>
    </div>
  );
};

export default Home;
