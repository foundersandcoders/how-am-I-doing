# How Am I Doing

## Projects

### Vision
Young People and their families using Mental Health Services should be in control, in particular, of the data they provide.  It should be available to them to understand their own progress, using the tools to which they have access: mobile phones, tablets, PC’s etc..  Sharing their data with services should be under their control. Data needs to be available in a format that respects their preference and be age-appropriate.

### What is the need?

##### For Young People & Families
* Have no control over own data
* Cannot readily access information tracking progress
* No feedback loop to be able to use data meaningfully and communicate with therapist  - disempowering
* Difficult to review things outside of sessions

##### For Clinicians
* No access to real time information about outcomes to support their work with CYP
* Time spent in sessions inputting and/or analysing data to make it useful
* Doing pointless tasks (data collection with no feedback) damages therapeutic engagement

##### For Services
* Wasteful of resources

### How will this help?

##### Benefits for Users
* Clear intelligible feedback
* Access to control of and personal data
* Share clear information instantly with clinicians

##### Benefits for Clinicians
*	Notice change or its absence

##### Benefits for Services
*	Improved data quantity and quality

### Core Features
*	Collects RCADS outcome data for mood and  displays time – series of collected data in accessible and engaging way for young people.
*	Permits the sharing of that information with clinicians and others

### Roadmap
* Links to self help tools

### Young People’s Decision Making Capacity and Data Management
*	How can parents, clinicians and young people negotiate who should be in charge of this data given legislation on parental responsibility and Fraser guidelines on decision capacity of young people?
*	How should risk be communicated, if detected in the use of this app.  To whom should it be communicated: YP, parent clinician?


## Development
Development guidelines for the project.

### Project Rules
1. Don't break the build
2. Link all pull requests to one or more issues
3. Pull requests should not contain incomplete features

### Coding Standards
Coding standards are defined by the `.eslintrc.json` in the project root. To check for linter errors, run:
```
$ npm run lint
```
If you are using atom, install the `linter-eslint` package. Similar packages exist for other text editors.

### Tests
```
$ npm test
```

### Travis
The travis build is [here](https://travis-ci.org/JackTierney/How-Am-I-Doing). Don't break it! It runs tests and checks for linter errors.

### Style Guide
#### Colours
<img alt="Colours" src="./assets/img/colours.png" width="400" />

#### Font
Ubuntu Mono

### Data Model

### User model

#### Basic user information

User id: PK, Number


Username: String


Email: Email


Secret: String

ClinicEmail: Email

ClinicNumber: String

### Question model

 All RCADS questions

Question id: PK, Number

Text: String

### Questionnaire model

All completed questionnaires from all users

Questionnaire id: PK, Number


Date: Date obj / String


Answers: Array of numbers (0-3) for each question

### Category Model

Cat id: PK, Number


Catname: String

### Relationships

User has many questionnaires.


Question has 1 category.


Questionnaire potentially has many categories.

### Dependencies
This project uses **caminte** for ORM. Read the documentation [here](http://www.camintejs.com/en/guide).
