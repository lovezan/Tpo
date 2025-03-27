import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact | NIT Hamirpur Placement Portal",
  description: "Contact the NIT Hamirpur Placement and Training Cell for queries related to placements and the portal",
}

export default function ContactPage() {
  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Contact Us</h1>
          <p className="text-muted-foreground">
            Get in touch with the NIT Hamirpur Placement and Training Cell for any queries or assistance
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Placement and Training Cell</CardTitle>
                <CardDescription>NIT Hamirpur</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-sm text-muted-foreground">
                      Placement and Training Cell
                      <br />
                      National Institute of Technology
                      <br />
                      Hamirpur, Himachal Pradesh - 177005
                      <br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-sm text-muted-foreground">+91-1972-254011</p>
                    <p className="text-sm text-muted-foreground">+91-1972-254012 (Fax)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground">placement@nith.ac.in</p>
                    <p className="text-sm text-muted-foreground">tpo@nith.ac.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Office Hours</h3>
                    <p className="text-sm text-muted-foreground">Monday to Friday: 9:00 AM - 5:00 PM</p>
                    <p className="text-sm text-muted-foreground">Saturday: 9:00 AM - 1:00 PM</p>
                    <p className="text-sm text-muted-foreground">Closed on Sundays and Public Holidays</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Contacts</CardTitle>
                <CardDescription>Reach out to our team members directly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Prof. Rajneesh Sharma</h3>
                  <p className="text-sm text-muted-foreground">Training and Placement Officer</p>
                  <p className="text-sm text-muted-foreground">Email: tpo@nith.ac.in</p>
                  <p className="text-sm text-muted-foreground">Phone: +91-1972-254035</p>
                </div>

                <div>
                  <h3 className="font-medium">Dr. Vinod Kumar</h3>
                  <p className="text-sm text-muted-foreground">Faculty Coordinator, Placements</p>
                  <p className="text-sm text-muted-foreground">Email: vinod@nith.ac.in</p>
                  <p className="text-sm text-muted-foreground">Phone: +91-1972-254036</p>
                </div>

                <div>
                  <h3 className="font-medium">Ms. Anjali Sharma</h3>
                  <p className="text-sm text-muted-foreground">Administrative Assistant</p>
                  <p className="text-sm text-muted-foreground">Email: admin.placement@nith.ac.in</p>
                  <p className="text-sm text-muted-foreground">Phone: +91-1972-254037</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connect With Us</CardTitle>
                <CardDescription>Follow us on social media for updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
                    <a href="https://www.linkedin.com/school/nit-hamirpur/" target="_blank" rel="noopener noreferrer">
                      LinkedIn <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
                    <a href="https://twitter.com/NITHamirpur" target="_blank" rel="noopener noreferrer">
                      Twitter <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
                    <a href="https://www.facebook.com/NITHamirpur" target="_blank" rel="noopener noreferrer">
                      Facebook <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <Input id="name" placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input id="email" type="email" placeholder="Your email" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input id="subject" placeholder="Subject of your message" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea id="message" placeholder="Your message" className="min-h-[150px]" />
                  </div>

                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-8 rounded-lg overflow-hidden h-[300px] border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3382.6349275374!2d76.52488491511874!3d31.708420981307237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3904d5487e12c4a1%3A0x395f92d3a202a7d0!2sNational%20Institute%20of%20Technology%2C%20Hamirpur!5e0!3m2!1sen!2sin!4v1648123456789!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-8 mt-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">How can companies register for campus placements?</h3>
              <p className="text-sm text-muted-foreground">
                Companies interested in recruiting from NIT Hamirpur can email us at placement@nith.ac.in with their
                requirements. Our team will share the recruitment process details and schedule.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">When does the placement season begin?</h3>
              <p className="text-sm text-muted-foreground">
                Our placement season typically begins in August for final year students. Pre-placement talks and
                activities start in July. Internship drives for pre-final year students usually begin in January.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How can alumni contribute to the placement portal?</h3>
              <p className="text-sm text-muted-foreground">
                Alumni can contribute by sharing their placement experiences through our submission form. They can also
                volunteer for mentorship programs and mock interviews by contacting us.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is there a placement brochure available?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, our latest placement brochure with details about departments, courses, and past placement
                statistics is available for download from the official NIT Hamirpur website.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

