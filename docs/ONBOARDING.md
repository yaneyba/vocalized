# Vocalized Platform - Onboarding Guide

**Last Updated**: 2025-11-05
**Version**: 1.0

---

## 📋 Table of Contents

1. [Platform Overview](#platform-overview)
2. [User Roles](#user-roles)
3. [Illustrated Use Case: Nail Salon](#illustrated-use-case-nail-salon)
4. [Admin Onboarding Workflow](#admin-onboarding-workflow)
5. [Client Onboarding Workflow](#client-onboarding-workflow)
6. [Quick Start Guides](#quick-start-guides)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Platform Overview

**Vocalized** is a Voice AI platform that enables businesses to create and manage AI-powered voice agents for customer interactions. The platform handles:

- 📞 Automated phone calls (inbound & outbound)
- 🤖 AI-powered voice conversations
- 📊 Call analytics and insights
- 💰 Usage tracking and billing
- 🔗 CRM and calendar integrations

---

## 👥 User Roles

### Admin (Platform Administrator)
- **Portal**: admin.vocalized.app
- **Responsibilities**:
  - Onboard new clients into the system
  - Configure subscription tiers
  - Monitor platform health and usage
  - Manage provider integrations (Twilio, ElevenLabs, etc.)
  - Handle billing and invoicing

### Client (Business Owner)
- **Portal**: app.vocalized.app
- **Responsibilities**:
  - Create and manage voice agents
  - Purchase and assign phone numbers
  - Monitor calls and analytics
  - Invite team members
  - Manage workspace settings

### Team Members (Client's Team)
- **Portal**: app.vocalized.app
- **Roles**: Owner, Admin, Member, Viewer
- **Responsibilities**: Based on assigned role within workspace

---

## 💅 Illustrated Use Case: Nail Salon

### Meet the Characters

**👩‍💼 Sarah Chen** - Nail Salon Owner
- Business: "Polished Perfection Nail Spa"
- Location: San Francisco, CA
- Needs: Automated appointment booking and customer confirmations
- Pain Points:
  - Spends 2-3 hours daily answering phone calls
  - Misses appointments due to no-shows
  - Can't afford a full-time receptionist

**👨‍💻 Marcus Williams** - Vocalized Admin
- Role: Platform Administrator
- Responsibilities: Onboard Sarah's business into Vocalized

---

### 📖 Complete Onboarding Story

#### Day 1, Morning: Initial Contact

**Sarah's Journey Begins:**
```
Sarah visits vocalized.app and clicks "Get Started"
She fills out a demo request form:
- Business Name: Polished Perfection Nail Spa
- Industry: Beauty & Wellness
- Phone: +1 (415) 555-0123
- Email: sarah@polishedperfection.com
- Use Case: Appointment booking and reminders
```

**Marcus Receives the Lead:**
```
Marcus sees the new lead in the admin portal
He reviews Sarah's information and determines:
- Tier: Professional ($99/month)
- Trial Period: 14 days
- Initial Setup: Appointment booking agent
```

---

#### Day 1, Afternoon: Admin Setup (Marcus's Workflow)

**Step 1: Marcus Creates Sarah's Account**

```
Admin Portal → Workspaces → Create New Client

Action: POST /admin/workspaces
Payload:
{
  "name": "Polished Perfection Nail Spa",
  "owner_email": "sarah@polishedperfection.com",
  "owner_name": "Sarah Chen",
  "industry": "beauty_wellness",
  "subscription_tier": "professional",
  "timezone": "America/Los_Angeles",
  "trial_ends_at": "2025-11-19T00:00:00Z"
}

Result:
✅ Workspace created: wks_abc123
✅ Owner account created: usr_xyz789
✅ Welcome email sent to Sarah
✅ Trial activated (14 days)
```

**Step 2: Marcus Provisions a Phone Number**

```
Admin Portal → Workspaces → wks_abc123 → Phone Numbers

Action: POST /admin/workspaces/wks_abc123/phone-numbers
Payload:
{
  "phone_number": "+14155550199",
  "friendly_name": "Main Salon Line",
  "provider": "twilio",
  "area_code": "415"
}

Result:
✅ Phone number activated: +1 (415) 555-0199
✅ Configured with Twilio
✅ Call forwarding ready
```

**Step 3: Marcus Creates a Template Voice Agent**

```
Admin Portal → Templates → Create Appointment Booking Agent

Configuration:
{
  "name": "Appointment Booking Assistant",
  "template_id": "tpl_appointment_booking_v1",
  "voice_provider": "elevenlabs",
  "voice_config": {
    "voice_id": "rachel_professional",
    "stability": 0.7,
    "similarity_boost": 0.8
  },
  "system_prompt": "You are a friendly receptionist for {business_name}.
    Help customers book appointments, answer questions about services,
    and confirm existing appointments. Business hours: {hours}.
    Services offered: {services}.",
  "capabilities": [
    "appointment_booking",
    "availability_check",
    "service_info",
    "price_quotes"
  ]
}

Result:
✅ Template agent created
✅ Ready for client customization
```

**Step 4: Marcus Sends Onboarding Email**

```
Email to: sarah@polishedperfection.com
Subject: Welcome to Vocalized! Your AI Receptionist is Ready

Hi Sarah,

Welcome to Vocalized! I've set up your account and you're ready to go.

🎁 Trial Details:
- 14-day free trial (ends Nov 19)
- Professional tier features unlocked
- 500 minutes included

📞 Your Phone Number:
+1 (415) 555-0199 - Main Salon Line

🚀 Next Steps:
1. Log in to app.vocalized.app
2. Set your password (link below)
3. Customize your AI receptionist
4. Test your first call!

Login: https://app.vocalized.app/setup?token=abc123

Questions? Reply to this email or call me at +1 (800) VOCAL-AI

Best,
Marcus Williams
Vocalized Customer Success
```

---

#### Day 1, Evening: Client Setup (Sarah's Workflow)

**Step 1: Sarah Sets Her Password**

```
Sarah clicks the link in Marcus's email
Page: app.vocalized.app/setup?token=abc123

Action: POST /auth/setup-password
Payload:
{
  "token": "abc123",
  "password": "MySecurePass123!",
  "password_confirm": "MySecurePass123!"
}

Result:
✅ Password set
✅ Logged into workspace
✅ Onboarding wizard starts
```

**Step 2: Sarah Completes the Onboarding Wizard**

```
Wizard Step 1: Business Information
- Business Hours: Mon-Sat 9am-7pm, Sun 10am-5pm
- Services: Manicure ($45), Pedicure ($65), Gel Nails ($75),
           Nail Art ($15-40), Full Set ($85)
- Average Appointment Duration: 60 minutes
- Technicians: 4

Wizard Step 2: Customize AI Voice
- Preview voice options
- Selected: "Rachel - Professional & Friendly"
- Test phrase: "Thank you for calling Polished Perfection!"
- ✅ Sounds perfect!

Wizard Step 3: Integration Setup
- Calendar: Connect Google Calendar
- OAuth: Authorize calendar access
- ✅ Connected to calendar
- Select calendar: "Salon Appointments"

Wizard Step 4: Custom Greetings
- Greeting: "Thank you for calling Polished Perfection Nail Spa!
            I'm your AI assistant. How can I help you today?"
- Appointment Confirmation: "Perfect! I've booked your {service}
            appointment for {date} at {time}. We'll send you a
            confirmation text. Is there anything else?"
```

**Step 3: Sarah Activates Her AI Agent**

```
Client Portal → Agents → "Appointment Booking Assistant"

Review Configuration:
✅ Phone: +1 (415) 555-0199
✅ Voice: Rachel (Professional)
✅ Calendar: Connected
✅ Business Hours: Set
✅ Services: Configured

Action: Activate Agent

Result:
✅ Agent status: draft → live
✅ Phone number now forwarding to AI
✅ Agent ready to receive calls
```

**Step 4: Sarah Makes a Test Call**

```
Sarah calls: +1 (415) 555-0199

Call Flow:
1. AI answers: "Thank you for calling Polished Perfection Nail Spa..."
2. Sarah (as customer): "Hi, I'd like to book a manicure"
3. AI: "I'd be happy to help! What day works best for you?"
4. Sarah: "Tomorrow at 2pm?"
5. AI: "Let me check our availability... Yes, we have an opening
       at 2pm tomorrow, November 6th. May I have your name?"
6. Sarah: "Sarah Chen"
7. AI: "Perfect Sarah! I've booked your manicure for tomorrow
       at 2pm. You'll receive a confirmation text shortly.
       Can I help with anything else?"
8. Sarah: "No, that's all!"
9. AI: "Great! We look forward to seeing you tomorrow at 2pm.
       Have a wonderful day!"

Test Result:
✅ Call completed successfully
✅ Calendar event created
✅ Confirmation SMS sent
✅ Call recorded and transcribed
```

---

#### Day 2-14: Trial Period

**Sarah's Daily Experience:**

```
Day 2: First Real Customer Call
- 8 calls received
- 6 appointments booked
- 2 service inquiries answered
- 0 missed calls
Sarah's reaction: "This is amazing! I can focus on my clients!"

Day 5: Sarah Invites Her Manager
Action: Workspace → Members → Invite
- Email: maria@polishedperfection.com
- Role: Admin
- ✅ Maria can now view analytics and manage agents

Day 7: Sarah Reviews Analytics
Dashboard shows:
- Total Calls: 47
- Appointments Booked: 38 (81% conversion)
- Avg Call Duration: 2m 34s
- Customer Satisfaction: 4.8/5
- Time Saved: 12 hours
- Revenue Generated: $2,850

Day 10: Sarah Adds an Outbound Reminder Agent
New Agent: "Appointment Reminder"
- Purpose: Call customers 24h before appointments
- Reduce no-shows
- Test call to herself: ✅ Works perfectly

Day 14: Trial Ends - Sarah Subscribes
Action: Billing → Subscribe to Professional
- Monthly: $99
- Includes: 1000 minutes/month
- Additional: $0.15/minute
Decision: ✅ Subscribed - Already seeing ROI!
```

---

#### Month 1: Ongoing Usage

**Sarah's Workflow After Onboarding:**

```
Weekly Routine:
1. Monday Morning:
   - Review last week's analytics
   - Check upcoming appointments
   - Listen to sample calls for quality

2. Daily:
   - Monitor live calls (if needed)
   - Check SMS confirmations
   - Review no-show rate (down from 25% to 5%!)

3. Monthly:
   - Review billing statement
   - Download call transcripts for training
   - Update AI prompts based on new services

Team Collaboration:
- Maria (Manager): Reviews daily analytics
- Technicians: Access their schedules
- Sarah: Full control + billing
```

---

## 🔧 Admin Onboarding Workflow

### Complete Admin Checklist

#### Pre-Onboarding (Before Client Contact)

- [ ] **Qualify the Lead**
  - Verify business type and use case
  - Determine appropriate tier
  - Assess integration needs
  - Calculate expected usage

- [ ] **Prepare Resources**
  - Review available phone numbers in target area
  - Check provider capacity (Twilio/Telnyx)
  - Prepare template agents for industry
  - Set up monitoring alerts

#### Initial Setup (Day 1)

- [ ] **Step 1: Create Client Workspace**
  ```
  Admin Portal → Workspaces → Create New
  - Business name
  - Owner contact info
  - Industry selection
  - Subscription tier
  - Trial duration
  - Timezone
  ```

- [ ] **Step 2: Provision Phone Number**
  ```
  - Select appropriate area code
  - Purchase from provider
  - Assign to workspace
  - Test connectivity
  ```

- [ ] **Step 3: Set Up Initial Agent**
  ```
  - Clone from template OR create custom
  - Configure voice provider
  - Set business context
  - Add capabilities
  - Assign phone number
  ```

- [ ] **Step 4: Configure Integrations (if needed)**
  ```
  - Calendar (Google/Outlook)
  - CRM (Salesforce/HubSpot)
  - SMS provider
  - Payment processor
  ```

- [ ] **Step 5: Send Welcome Email**
  ```
  - Login credentials
  - Setup link
  - Trial details
  - Contact information
  - Next steps
  ```

#### Post-Setup Monitoring (Days 2-14)

- [ ] **Day 2: Check First Calls**
  - Review call quality
  - Verify integrations working
  - Address any issues

- [ ] **Day 7: Mid-Trial Check-in**
  - Email client for feedback
  - Review usage analytics
  - Suggest optimizations

- [ ] **Day 12: Pre-Trial End**
  - Send trial ending reminder
  - Showcase ROI metrics
  - Offer conversion incentive

- [ ] **Day 14: Trial Conversion**
  - Follow up on subscription decision
  - Process payment if converting
  - Extend trial if needed

---

## 👤 Client Onboarding Workflow

### Complete Client Checklist

#### Account Setup (Day 1)

- [ ] **Step 1: Set Password & Login**
  - Click setup link from email
  - Create secure password
  - Log in to app.vocalized.app
  - Complete profile

- [ ] **Step 2: Business Configuration**
  - Enter business hours
  - Add services/products
  - Set timezone
  - Upload logo (optional)

- [ ] **Step 3: Customize AI Voice Agent**
  - Preview voice options
  - Test with sample phrases
  - Select preferred voice
  - Customize greetings

- [ ] **Step 4: Connect Integrations**
  - Google Calendar / Outlook
  - CRM system (if applicable)
  - Payment processor (if applicable)
  - SMS notifications

- [ ] **Step 5: Configure Agent Settings**
  - Review system prompt
  - Add custom responses
  - Set call routing rules
  - Configure fallback options

- [ ] **Step 6: Test Your Agent**
  - Make test call
  - Try different scenarios
  - Review recording
  - Adjust as needed

#### Going Live (Day 1-2)

- [ ] **Step 7: Activate Agent**
  - Review final configuration
  - Click "Activate"
  - Verify phone number active

- [ ] **Step 8: Update Marketing Materials**
  - Update website with new number
  - Update Google Business listing
  - Update social media
  - Update business cards

- [ ] **Step 9: Train Your Team**
  - Share access to portal
  - Review analytics dashboard
  - Explain call handling
  - Set up notifications

#### Optimization (Week 1-2)

- [ ] **Step 10: Monitor & Adjust**
  - Review daily call logs
  - Listen to sample calls
  - Adjust prompts as needed
  - Fine-tune responses

- [ ] **Step 11: Expand Usage**
  - Add outbound calling (reminders)
  - Set up additional agents
  - Invite team members
  - Explore advanced features

---

## 🚀 Quick Start Guides

### For Admins: 5-Minute Client Setup

```bash
1. Create Workspace (2 min)
   Admin Portal → New Workspace → Fill form → Create

2. Add Phone Number (1 min)
   Workspace → Phone Numbers → Purchase → Assign

3. Clone Template Agent (1 min)
   Workspace → Agents → Use Template → Configure

4. Send Welcome Email (1 min)
   Review → Send Setup Link → Done!

Total Time: ~5 minutes
```

### For Clients: 10-Minute Setup

```bash
1. Set Password (1 min)
   Click email link → Set password → Login

2. Complete Wizard (5 min)
   Business info → Voice selection → Integrations → Greetings

3. Test Agent (2 min)
   Review → Make test call → Verify

4. Activate (1 min)
   Final review → Activate → Live!

5. Update Marketing (1 min)
   Add new number to website/listings

Total Time: ~10 minutes
```

---

## ✅ Best Practices

### For Admins

**Do's:**
- ✅ Always test agent before sending setup link
- ✅ Choose phone numbers in client's area code
- ✅ Set realistic trial expectations
- ✅ Monitor first week of calls closely
- ✅ Provide industry-specific templates
- ✅ Document custom configurations

**Don'ts:**
- ❌ Don't skip the welcome email
- ❌ Don't assign generic prompts
- ❌ Don't forget to set timezone correctly
- ❌ Don't over-promise capabilities
- ❌ Don't neglect post-setup follow-up

### For Clients

**Do's:**
- ✅ Test thoroughly before going live
- ✅ Start with simple use cases
- ✅ Review calls regularly for quality
- ✅ Update prompts based on real conversations
- ✅ Invite team members early
- ✅ Monitor analytics weekly

**Don'ts:**
- ❌ Don't activate without testing
- ❌ Don't use overly complex prompts
- ❌ Don't ignore customer feedback
- ❌ Don't forget to update business listings
- ❌ Don't skip the training for staff

---

## 🔧 Troubleshooting

### Common Admin Issues

**Issue: Client not receiving welcome email**
```
Solution:
1. Check email in workspace settings
2. Verify email not in spam
3. Resend from Admin Portal → Workspace → Actions → Resend Welcome
4. Contact client via phone if needed
```

**Issue: Phone number not connecting**
```
Solution:
1. Verify provider status (Twilio/Telnyx dashboard)
2. Check number configuration in Admin Portal
3. Test with outbound call
4. Verify webhooks configured
5. Check provider balance
```

**Issue: Agent not activating**
```
Solution:
1. Ensure phone number assigned
2. Verify voice provider credentials
3. Check agent configuration completeness
4. Review error logs in Admin Portal
5. Test with different voice provider
```

### Common Client Issues

**Issue: Can't log in**
```
Solution:
1. Click "Forgot Password" on login page
2. Check email for reset link
3. Verify using correct email address
4. Contact support if still issues
```

**Issue: AI not understanding customers**
```
Solution:
1. Review call transcripts
2. Add common phrases to training
3. Adjust system prompt clarity
4. Consider voice provider switch
5. Add FAQ to agent knowledge base
```

**Issue: Calendar not syncing**
```
Solution:
1. Re-authorize calendar connection
2. Check calendar permissions
3. Verify correct calendar selected
4. Test with manual appointment
5. Contact support for integration help
```

**Issue: High call costs**
```
Solution:
1. Review call duration analytics
2. Optimize agent responses (shorter)
3. Add call timeout settings
4. Consider upgrading to higher tier
5. Review call routing rules
```

---

## 📞 Support & Resources

### For Admins
- **Admin Portal**: admin.vocalized.app
- **Support Email**: admin-support@vocalized.app
- **Documentation**: docs.vocalized.app/admin
- **Status Page**: status.vocalized.app

### For Clients
- **Client Portal**: app.vocalized.app
- **Support Email**: support@vocalized.app
- **Help Center**: help.vocalized.app
- **Community Forum**: community.vocalized.app
- **Live Chat**: Available in portal (9am-5pm PT)

---

## 📚 Additional Resources

- [API Documentation](API.md) - For developers
- [Integration Guide](INTEGRATIONS.md) - Connect your tools
- [Pricing Guide](PRICING.md) - Understand billing
- [Best Practices](BEST_PRACTICES.md) - Optimize your agents
- [Use Case Library](USE_CASES.md) - Industry examples

---

**Questions?** Contact our team at onboarding@vocalized.app

**Last Updated**: 2025-11-05
**Next Review**: Quarterly or as platform features change
