# Ethical Use of AI — MzansiBuilds

## Statement

This document declares how AI tools were used during the
development of MzansiBuilds, in accordance with the Derivco
Code Skills Quest Ethical Use of AI competency.

---

## AI Tools Used

### Claude (Anthropic)
Used as a front-end development
assistant and learning tool.


---

## How Claude Was Used

### Learning and understanding
- Breaking down error messages and explaining what caused them
- Explaining testing concepts including mocking, vi.fn(),
  and the Red-Green-Refactor TDD cycle

### Code generation assistance
- Generating Front-end code and developing UIs
- Suggesting Supabase query patterns
- Writing GitHub Actions YAML configuration
- Drafting documentation files

### Debugging
- Identifying issues in component logic
- Explaining why certain Supabase queries were returning
  unexpected results
- Helping trace blank screen issues to their root cause

---

## What Was NOT AI Generated

The following decisions and implementations were made by the
developer independently:

- The choice to use Supabase over Firebase or a custom backend
- The database schema design: table structure, relationships,
  and field choices
- The decision to use RLS for security rather than API-level checks
- The architecture decision to separate data logic into hooks
- The test cases: what to test and why
- Understanding and being able to explain every line of code
  in the final submission
- Debugging and fixing integration issues between components
- The project brief, user stories, and UML diagrams

---

## Verification Standard

No AI-generated code was submitted without being read,
understood, and manually integrated.

Where Claude generated code, I:
1. Read every line before copying it
2. Understood what it does and why
3. Was able to explain it if asked
4. Modified it where needed to fit the project's specific requirements

AI was used as a learning accelerator and productivity tool,
not as a replacement for understanding.

---

This project used AI to move faster and learn more effectively.
Every architectural and design decision remained mine.