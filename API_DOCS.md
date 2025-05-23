# AI Support Portal API Documentation

## Overview

This document outlines the API endpoints available in the AI Support Portal. The API enables interaction with the knowledge base, intent classification, and analytics system.

## Base URL

All endpoints are relative to your deployment URL:

```
https://your-deployment-url.com/api
```

## Authentication

For analytics endpoints, include an API key in the Authorization header:

```
Authorization: Bearer your-api-key
```

## Endpoints

### 1. Knowledge Base Query

```
POST /ask
```

Query the knowledge base to find answers to customer questions.

#### Request

```json
{
  "question": "What products do you offer?"
}
```

#### Response

```json
{
  "answer": "We offer several AI-powered chatbots designed for customer support automation...",
  "source": "Docs",
  "sourceType": "doc",
  "sourceId": "doc-5",
  "sourceTitle": "Chatbot Overview",
  "confidence": 85,
  "relatedQuestions": [
    "How do I integrate chatbots with my existing systems?",
    "What features do your bots have?",
    "How much do your bots cost?"
  ]
}
```

### 2. Intent Classification

```
POST /classify
```

Classify user messages into intents and generate appropriate responses.

#### Request

```json
{
  "user_message": "I have a billing question about my subscription"
}
```

#### Response

```json
{
  "intent": "billing",
  "answer": "It seems like you have a question about billing. I can help you with invoices, payment methods, subscription changes, and other billing-related matters.",
  "escalation_needed": false
}
```

#### Escalation Example

```json
{
  "intent": "escalation_needed",
  "answer": "I apologize for any inconvenience. It seems this issue requires special attention. I'll help connect you with a support specialist who can better assist with your specific situation.",
  "escalation_needed": true,
  "reason": "Billing issue beyond support tier",
  "escalation_path": "Support Agent → Billing Team → Finance Lead"
}
```

### 3. Analytics

#### Record Analytics

```
POST /analytics
```

Record a query and its response for analytics purposes.

```json
{
  "query": "How do I reset my password?",
  "responseSource": "FAQ",
  "confidence": 90,
  "intent": "account_settings",
  "successful": true
}
```

#### Get Analytics

```
GET /analytics?timeFrame=24h
```

Retrieve analytics data for queries.

Query Parameters:
- `timeFrame`: `24h` (default), `7d`, `30d`, or `all`

Response:

```json
{
  "timeFrame": "24h",
  "totalQueries": 150,
  "successRate": 85.3,
  "avgConfidence": 78.2,
  "sourceStats": {
    "FAQ": { "count": 67, "successful": 62 },
    "Docs": { "count": 54, "successful": 48 },
    "Rulebook": { "count": 18, "successful": 14 },
    "Escalation": { "count": 6, "successful": 4 },
    "System": { "count": 5, "successful": 0 }
  },
  "intentStats": {
    "product_info": { "count": 52, "avgConfidence": 82.3, "successRate": 92.3 },
    "billing": { "count": 35, "avgConfidence": 75.8, "successRate": 82.9 },
    "technical_issue": { "count": 30, "avgConfidence": 72.5, "successRate": 80.0 },
    "account_settings": { "count": 28, "avgConfidence": 81.2, "successRate": 89.3 },
    "escalation_needed": { "count": 5, "avgConfidence": 94.0, "successRate": 100.0 }
  },
  "topQueries": [
    { "query": "how do i reset my password", "count": 12 },
    { "query": "what bots do you offer", "count": 10 },
    { "query": "how much does supportbot pro cost", "count": 8 }
  ],
  "recentQueries": [
    {
      "timestamp": "2025-05-22T12:34:56.789Z",
      "query": "How do I integrate with Salesforce?",
      "source": "Docs",
      "confidence": 85,
      "intent": "technical_issue"
    }
  ]
}
```

### 4. Examples

```
GET /examples?scenario=billing
```

Get example responses for different scenarios.

Query Parameters:
- `scenario`: `billing`, `technical`, `account`, `urgent`, `default`, or `classification`
- `message`: (Optional) Custom message to classify when scenario is `classification`

## Error Handling

All endpoints return standard HTTP status codes:

- `200`: Success
- `400`: Bad Request (missing or invalid parameters)
- `401`: Unauthorized (missing or invalid API key)
- `500`: Internal Server Error

Error responses include an error message:

```json
{
  "error": "Please provide a valid question."
}
```

## Rate Limiting

To prevent abuse, API endpoints are rate-limited to 100 requests per minute per IP address.

## Versioning

The current API version is v1. All endpoints are under the base path without an explicit version prefix.

---

For questions or support, contact the development team at api-support@example.com. 