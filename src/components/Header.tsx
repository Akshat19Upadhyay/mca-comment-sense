import { FileText, BarChart3, MessageSquare } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-gradient-hero shadow-glow relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm"></div>
      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl shadow-medium">
                <FileText className="h-10 w-10 text-white" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold tracking-tight">e-Consultation Analytics</h1>
                <p className="text-lg text-white/90 font-medium">Ministry of Corporate Affairs</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3 text-white/90 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">Sentiment Analysis</span>
            </div>
            <div className="flex items-center space-x-3 text-white/90 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <BarChart3 className="h-5 w-5" />
              <span className="font-medium">Analytics Dashboard</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;