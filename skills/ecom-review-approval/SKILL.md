---
name: ecom-review-approval
description: "Use to review ecommerce images, titles, detail pages, videos and research outputs, and to bind human approvals to an exact run, version and scope. Separates generated, reviewed, approved, delivered and published states."
version: 1.0.0
---

# Ecommerce Review and Approval

Apply review and approval without becoming a competing content director.

## Review dimensions

Review the dimensions relevant to the artifact:

- SKU/brand/reference identity;
- factual and claim safety;
- variant, package and specification correctness;
- task or slot mission;
- platform/market/language fit;
- readability and technical integrity;
- privacy, rights and compliance boundaries.

Return `pass`, `needs_revision`, `fail`, or `blocked`, with failure codes and required fixes. Automated review never creates human approval.

## Approval scopes

Use explicit scopes such as `direction`, `sample`, `pack`, `script`, `copy`, `research`, `delivery`, and `publish`. Record:

```text
run_id
artifact/version
stage
approver identity
approver role
approved scope
timestamp
real-call authorization when relevant
```

Any material change creates a new version and invalidates approval for the changed scope. Review does not imply approval. Approval does not imply delivery. Delivery does not imply publication. `published` requires external platform evidence.
