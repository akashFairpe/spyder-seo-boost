import { useEffect } from "react";
import { Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppSharing } from "@/contexts/AppContext";
import { login, getGoogleProfile } from "@/lib/api";

export const LoginSection = () => {
  const { baseUrl, setProfileData, setIsLoading } = useAppSharing();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.xid) {
        const xid = event.data.xid;
        const isProduction = window.location.hostname.includes("seospyder.io");
        console.log("XID received:", event.data);

        if (isProduction) {
          document.cookie = `xid=${xid}; path=/; max-age=${
            15 * 24 * 60 * 60
          }; Secure; SameSite=None; domain=.seospyder.io`;
        } else {
          document.cookie = `xid=${xid}; path=/; max-age=${15 * 24 * 60 * 60};Secure; SameSite=None`;
          document.cookie = `xid=${xid}; path=/; max-age=${
            15 * 24 * 60 * 60
          }; Secure; SameSite=None`;
        }
      }

      if (event.data && event.data.xindex === 0) {
        getGoogleProfile(baseUrl, setProfileData, setIsLoading);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [baseUrl, setProfileData, setIsLoading]);

  const handleGoogleLogin = () => {
    login(baseUrl, setIsLoading);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Chrome className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SEO Spyder</h1>
          <p className="text-gray-600">Optimize your blog pages with AI-powered insights</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your SEO optimization dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGoogleLogin}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              size="lg"
            >
              <Chrome className="w-5 h-5 mr-3" />
              Sign in with Google
            </Button>

            <div className="text-center text-sm text-gray-500 mt-4">
              <p>Connect your Google Analytics and Search Console</p>
              <p>to start optimizing your content</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-gray-400">
          <p>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};
