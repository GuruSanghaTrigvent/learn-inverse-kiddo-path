import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { ArrowRight, GraduationCap, Sparkles, Lightbulb, Smile, MessageCircleQuestion } from "lucide-react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const simpleAnimation = {
  "v": "5.7.4",
  "fr": 30,
  "ip": 0,
  "op": 60,
  "w": 400,
  "h": 400,
  "nm": "Simple Animation",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Shape Layer",
      "sr": 1,
      "ks": {
        "o": { "a": 0, "k": 100 },
        "p": {
          "a": 1,
          "k": [
            {
              "t": 0,
              "s": [200, 200],
              "i": { "x": 0.667, "y": 1 },
              "o": { "x": 0.333, "y": 0 }
            },
            {
              "t": 30,
              "s": [200, 150]
            },
            {
              "t": 60,
              "s": [200, 200]
            }
          ]
        },
        "a": { "a": 0, "k": [0, 0, 0] },
        "s": { "a": 0, "k": [100, 100, 100] }
      },
      "shapes": [
        {
          "ty": "rc",
          "d": 1,
          "s": { "a": 0, "k": [50, 50] },
          "p": { "a": 0, "k": [0, 0] },
          "r": { "a": 0, "k": 0 }
        },
        {
          "ty": "fl",
          "c": { "a": 0, "k": [0.545, 0.337, 0.976, 1] },
          "o": { "a": 0, "k": 100 }
        }
      ]
    }
  ]
};

const Index = () => {
  console.log("Rendering Index component with animation data:", simpleAnimation);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 hero-gradient">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              Revolutionizing children's education
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Schools Aren't Preparing Kids<br />
              for the Real World.{" "}
              <span className="text-primary">We Fix That.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Teach your kids real world skills and problem solving abilities that will help mold them into independent leaders.
            </p>
            <Link to="/register">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg button-hover">
                Try it free
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Did You Know Most Kids Graduate Without Basic Life Skills?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="h-8 w-8 text-primary animate-bounce" />,
                title: "Financial Literacy Gap",
                description: "Only 7 states in the U.S. require financial literacy courses, leaving millions unprepared."
              },
              {
                icon: <Lightbulb className="h-8 w-8 text-primary animate-pulse" />,
                title: "Skills Mismatch",
                description: "80% of employers say today's graduates lack problem-solving and leadership skills."
              },
              {
                icon: <Smile className="h-8 w-8 text-primary animate-float" />,
                title: "Life Skills Crisis",
                description: "Many young adults don't know how to manage money, negotiate, or make big decisions."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-secondary p-8 rounded-2xl shadow-lg card-hover">
                <div className="mb-4 transform hover:scale-110 transition-transform duration-200">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">We Teach the Skills That Actually Matter</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform builds critical life skills based on principles used by successful entrepreneurs, CEOs, and industry leaders.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <div className="bg-gradient-to-br from-purple-100/10 to-pink-100/10 rounded-3xl p-8 min-h-[200px] flex items-center justify-center relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="text-center z-10">
                      <h3 className="text-2xl font-bold text-gray-100 mb-4">Work & Jobs</h3>
                      <p className="text-gray-300">Learn about working and leading!</p>
                      <div className="mt-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/20 text-orange-400">
                        <Sparkles className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                ),
                title: "Work & Jobs",
                description: "Learn about working and leading!"
              },
              {
                icon: <GraduationCap className="h-8 w-8 text-primary animate-pulse" />,
                title: "Leadership & Decision-Making",
                description: "Public speaking, problem-solving, and negotiation."
              },
              {
                icon: <Lightbulb className="h-8 w-8 text-primary animate-float" />,
                title: "Practical Life Skills",
                description: "Basic home maintenance, cooking, cleaning, and self-reliance."
              },
              {
                icon: <Smile className="h-8 w-8 text-primary animate-bounce" />,
                title: "Career Readiness",
                description: "Resume writing, interview prep, and work ethics."
              }
            ].map((skill, index) => (
              <div key={index} className="bg-muted p-8 rounded-2xl shadow-lg card-hover">
                <div className="mb-4 transform hover:scale-110 transition-transform duration-200">
                  {skill.icon}
                </div>
                {index !== 0 && (
                  <>
                    <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
                    <p className="text-gray-300">{skill.description}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Age Range Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-secondary to-background rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Designed For Kids 5-12
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Learn at your own pace. Fun, interactive learning for each age group.
            </p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg button-hover">
              Get Started Now
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
              <MessageCircleQuestion className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Got questions? We've got answers. Here are some of the most common questions parents ask us.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto bg-secondary/50 rounded-2xl p-6 shadow-lg">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-white/10">
                <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline">
                  What age group is LearnKids designed for?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-4">
                  LearnKids is specially designed for children aged 5-12 years old. Our platform offers age-appropriate content and 
                  activities that grow with your child, adapting to their developing skills and interests.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-b border-white/10">
                <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline">
                  How much does LearnKids cost?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-4">
                  We offer a free trial period so you can experience the platform with your child. After that, 
                  we have affordable monthly and annual subscription plans. Visit our pricing page for detailed information.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-b border-white/10">
                <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline">
                  How do I track my child's progress?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-4">
                  Parents have access to a dedicated dashboard where you can monitor your child's lessons completed, 
                  skills mastered, and overall progress. You'll receive regular updates and can review areas where your child excels or needs more support.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border-b border-white/10">
                <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline">
                  Can I add multiple children to one account?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-4">
                  Yes! You can add multiple children to your parent account and manage their profiles separately. 
                  Each child will have their own personalized learning experience based on their age and progress.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline">
                  What skills will my child learn?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-4">
                  LearnKids focuses on practical life skills including financial literacy, critical thinking, problem-solving, 
                  leadership, communication, and self-management. These are skills rarely taught in traditional schools but essential for future success.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="mt-8 text-center">
              <p className="mb-4 text-gray-300">Don't see your question?</p>
              <a href="mailto:support@learnkids.com" className="text-primary hover:underline">Contact our support team</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-muted py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">LearnKids</h3>
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
                  <a href="mailto:support@learnkids.com" className="text-gray-300 hover:text-primary transition-colors">
                    support@learnkids.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-center text-gray-300">
              © {new Date().getFullYear()} LearnKids. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
