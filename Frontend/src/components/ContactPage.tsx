import { Mail, Phone, MapPin, Github, Linkedin, MessageCircle, Instagram } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";

export function ContactPage() {
  const teamMembers = [
    {
      name: "Aman Pal",
      role: "Full Stack Developer",
      email: "aman.pal@student.ltce.in",
      github: "amanpal-dev",
      linkedin: "amanpal-dev",
      instagram: "aman.pal.dev"
    },
    {
      name: "Sagar Raikwar", 
      role: "AI/ML Engineer",
      email: "sagar.raikwar@student.ltce.in",
      github: "sagar-raikwar",
      linkedin: "sagar-raikwar",
      instagram: "sagar.raikwar"
    },
    {
      name: "Siddhesh Shinde",
      role: "Computer Vision Specialist", 
      email: "siddhesh.shinde@student.ltce.in",
      github: "siddhesh-shinde",
      linkedin: "siddhesh-shinde",
      instagram: "siddhesh.shinde"
    },
    {
      name: "Saurabh Yadav",
      role: "Backend Developer",
      email: "saurabh.yadav@student.ltce.in", 
      github: "saurabh-yadav",
      linkedin: "saurabh-yadav",
      instagram: "saurabh.yadav"
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--pastel-blue-dark)] to-[var(--pastel-lavender-dark)] rounded-full flex items-center justify-center shadow-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4 drop-shadow-sm">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto drop-shadow-sm">
            Have questions about IntelliVision? Want to collaborate or provide feedback? 
            We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <Card className="bg-card/80 backdrop-blur-sm border-2 border-border shadow-xl rounded-3xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2 drop-shadow-sm">
                <Mail className="w-5 h-5 text-[var(--pastel-blue-dark)]" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-2 block drop-shadow-sm">Name</label>
                  <Input 
                    placeholder="Your full name" 
                    className="bg-input-background border-2 border-border text-card-foreground font-medium"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-2 block drop-shadow-sm">Email</label>
                  <Input 
                    type="email" 
                    placeholder="your.email@example.com" 
                    className="bg-input-background border-2 border-border text-card-foreground font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block drop-shadow-sm">Subject</label>
                <Input 
                  placeholder="What's this about?" 
                  className="bg-input-background border-2 border-border text-card-foreground font-medium"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block drop-shadow-sm">Message</label>
                <Textarea 
                  placeholder="Tell us more about your inquiry..." 
                  rows={6}
                  className="bg-input-background border-2 border-border text-card-foreground resize-none font-medium"
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-[var(--pastel-blue-dark)] to-[var(--pastel-lavender-dark)] hover:from-[var(--pastel-blue-dark)]/90 hover:to-[var(--pastel-lavender-dark)]/90 text-white rounded-2xl py-6 shadow-lg hover:shadow-xl transition-all duration-300 font-bold">
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="bg-card/80 backdrop-blur-sm border-2 border-border shadow-xl rounded-3xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-card-foreground mb-6 drop-shadow-sm">Project Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-[var(--pastel-mint-dark)] mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-card-foreground drop-shadow-sm">Location</p>
                      <p className="text-sm font-medium text-muted-foreground drop-shadow-sm">
                        Lokmanya Tilak College of Engineering<br />
                        Koparkhairane, Navi Mumbai, Maharashtra
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-[var(--pastel-lavender-dark)] mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-card-foreground drop-shadow-sm">Academic Department</p>
                      <p className="text-sm font-medium text-muted-foreground drop-shadow-sm">
                        Computer Science Engineering - AI & ML<br />
                        Final Year Project 2024-25
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-2 border-border shadow-xl rounded-3xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-card-foreground mb-6 drop-shadow-sm">Project Repository</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-3 rounded-2xl border-2 border-border hover:bg-accent font-semibold">
                    <Github className="w-4 h-4" />
                    View Project Repository
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Members */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12 drop-shadow-sm">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm border-2 border-border shadow-lg rounded-3xl hover:shadow-xl hover:scale-105 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[var(--pastel-blue-dark)] to-[var(--pastel-lavender-dark)] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-bold text-card-foreground mb-1 drop-shadow-sm">{member.name}</h3>
                  <Badge variant="secondary" className="mb-4 rounded-full font-medium">
                    {member.role}
                  </Badge>
                  <div className="space-y-2">
                    <Button variant="ghost" size="sm" className="w-full text-xs rounded-xl hover:bg-accent font-medium">
                      <Mail className="w-3 h-3 mr-2" />
                      {member.email}
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 rounded-xl border-2 border-gray-800 bg-gray-900 hover:bg-gray-800 text-white font-semibold"
                      >
                        <Github className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 rounded-xl border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                      >
                        <Linkedin className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 rounded-xl border-2 border-pink-500 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold"
                      >
                        <Instagram className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}