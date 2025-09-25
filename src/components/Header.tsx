import { FileText, BarChart3, MessageSquare } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-soft">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold">e-Consultation Analytics</h1>
                <p className="text-sm text-primary-foreground/80">Ministry of Corporate Affairs</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm">
              <MessageSquare className="h-4 w-4" />
              <span>Sentiment Analysis</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics Dashboard</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;