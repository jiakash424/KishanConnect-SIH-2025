"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Mail, Phone, User, GraduationCap, Building } from "lucide-react";

const teamMembers = [
  {
    name: "Anushka Sharma",
    role: "Team Leader",
    rollNo: "2300330120021",
    branch: "CS - A",
    phone: "9045305411",
    email: "as4019844@gmail.com",
    avatar: "AS",
  },
  {
    name: "Akash kumar",
    role: "Team Member",
    rollNo: "2300331530011",
    branch: "CSE-Aiml / A",
    phone: "9411621096",
    email: "jiakash427@gmail.com",
    avatar: "AK",
  },
  {
    name: "Vishnu yadav",
    role: "Team Member",
    rollNo: "2300331530125",
    branch: "CSE-Aiml / B",
    phone: "6398394054",
    email: "vishnu29sep@gmail.com",
    avatar: "VY",
  },
  {
    name: "Anshika Gupta",
    role: "Team Member",
    rollNo: "2300330100061",
    branch: "CSE / A",
    phone: "8808389326",
    email: "anshikaagupta74286@gmail.com",
    avatar: "AG",
  },
  {
    name: "Ankush Yadav",
    role: "Team Member",
    rollNo: "2300330100055",
    branch: "CSE / A",
    phone: "8052434076",
    email: "anyadav8052@gmail.com",
    avatar: "AY",
  },
  {
    name: "Aparna Bhardwaj",
    role: "Team Member",
    rollNo: "2300330120022",
    branch: "CS, A",
    phone: "9310939887",
    email: "aparnabhardwaj867@gmail.com",
    avatar: "AB",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">About KrishiConnect</h1>
        <p className="text-muted-foreground">
          Project and team information for Smart India Hackathon 2025.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Smart India Hackathon 2025 | Problem Statement SIH25099</CardTitle>
           <CardDescription className="flex items-center gap-2 pt-2">
            <Building className="h-4 w-4" />
            Organization: MathWorks India Pvt. Ltd.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <h3 className="font-semibold text-lg">AI-powered monitoring of crop health, soil condition, and pest risks using multispectral/hyperspectral imaging and sensor data.</h3>
            <p className="text-muted-foreground">
            Agriculture faces growing threats from soil degradation, unpredictable weather, and pest outbreaks, leading to reduced yields and economic losses. Traditional monitoring methods are often delayed, labor-intensive, and lack precision. There is a need for a unified software platform that integrates remote sensing and sensor data to provide timely, field-level insights on crop health, soil conditions, and pest risks using AI-driven analysis.
            </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users /> Team Innovatrix</CardTitle>
          <CardDescription>Meet the team behind KrishiConnect.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <Card key={member.rollNo}>
              <CardHeader className="flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{member.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>{member.rollNo} ({member.branch})</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${member.phone}`} className="hover:underline">{member.phone}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                   <a href={`mailto:${member.email}`} className="hover:underline truncate">{member.email}</a>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
