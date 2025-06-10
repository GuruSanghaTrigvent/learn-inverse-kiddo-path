
const Footer = () => {
  return (
    <footer className="bg-muted py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FFD93D] to-[#F8B500] bg-clip-text text-transparent">HoneyLearn</h3>
            <p className="text-gray-300">
              Teaching real-world skills to the next generation
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="/terms" className="text-gray-300 hover:text-primary transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-300 hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@honeylearn.com" className="text-gray-300 hover:text-primary transition-colors">
                  support@honeylearn.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-300">
            © {new Date().getFullYear()} HoneyLearn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
