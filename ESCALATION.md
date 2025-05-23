# AI Support Portal - Enhanced Escalation System

This documentation covers the enhanced escalation system implemented in the AI Support Portal.

## Overview

The escalation system automatically detects when a customer query requires escalation to a higher support tier and provides:
- The customer-facing answer
- Whether escalation is needed
- The reason for escalation
- The recommended escalation path

## Response Format

When escalation is needed, the system returns:

```json
{
  "intent": "escalation_needed",
  "answer": "I apologize for any inconvenience. It seems this issue requires special attention. I'll help connect you with a support specialist who can better assist with your specific situation.",
  "escalation_needed": true,
  "reason": "Billing issue beyond support tier",
  "escalation_path": "Support Agent → Billing Team → Finance Lead"
}
```

## Escalation Types

The system can detect the following escalation scenarios:

1. **Billing Issues**: Customer inquiries about billing that require specialized assistance
   - **Path**: Support Agent → Billing Team → Finance Lead

2. **Technical Issues**: Complex technical problems requiring developer intervention
   - **Path**: Support Agent → Technical Support → Senior Developer

3. **Account Management**: Issues requiring elevated permissions or security expertise
   - **Path**: Support Agent → Account Management Team → Security Lead

4. **Urgent Issues**: Time-sensitive matters needing immediate attention
   - **Path**: Support Agent → Incident Response Team

5. **Customer Satisfaction**: General dissatisfaction or escalation requests
   - **Path**: Support Agent → Customer Success Manager

## Using the Escalation API

### Classification Endpoint

```
POST /api/classify
```

Request body:
```json
{
  "user_message": "I need to speak to a manager about my billing issue urgently"
}
```

Response:
```json
{
  "intent": "escalation_needed",
  "answer": "I apologize for any inconvenience. It seems this issue requires special attention. I'll help connect you with a support specialist who can better assist with your specific situation.",
  "escalation_needed": true,
  "reason": "Billing issue beyond support tier",
  "escalation_path": "Support Agent → Billing Team → Finance Lead"
}
```

### Example Endpoint

For testing purposes, you can view example responses:

```
GET /api/examples?scenario=billing
GET /api/examples?scenario=technical
GET /api/examples?scenario=account
GET /api/examples?scenario=urgent
GET /api/examples?scenario=default
GET /api/examples?scenario=classification&message=YOUR_MESSAGE_HERE
```

## Implementation

The escalation system uses a combined approach:
1. Intent classification to detect when escalation is needed
2. Contextual analysis to determine the appropriate escalation type and path
3. Score-based analysis of multiple intents to handle mixed queries (e.g., urgent billing issues) 