# Lighthouse - Final Project for CS546
Reflecting on our time at Stevens, we’ve found that in order to run a successful course, communication among instructors and students is paramount. The team has used several platforms for course communication at Stevens: Slack, Piazza, Canvas discussions, and more.  While all of them have their merits, they all fall into some familiar problems:  too clunky, outdated UI,or hard to sort through.  Lighthouse is our attempt at building a solution that is easy to use and quick in getting you the answer you need.

While platforms like Slack and Piazza are normally perfectly viable solutions,  once the frequency of questions being asked increases,  it becomes arduous to dig through all conversation threads and becomes much easier to simply ask a question without looking at previous threads, even if it might be a duplicate.  What this ends up doing is it just adds to the sheer amount of  conversation  threads  to  sort  through  and  makes  it  harder  for  the  next person to find what they’re looking for.  Thus, the cycle continues.  Lighthouse aims to combat the problem of scale through auto-tagging features and identifying similar questions before submission and redirecting them to questions that might be able to solve their problem


# Instructions on how to run
We used MongoDB Atlas so there's no need for a seed file for the database. To connect to the database, go to the .env_example file and replace it with the database key. The Mongo URI is provided in the Canvas submission but is excluded from the Github repository.

Once that is done, rename .env_example to .env. Once the repo has been cloned locally, run 
```npm i```
and then 
```npm start```
in the project root directory.

The server will then be on http://localhost:3000 

Note: Our submission already reflects these changes to the .env file so you should not have to modify it with the Mongo URI. Only run `npm i` and `npm start`.

# User Credentials 
The database comes populated with several student and instructor accounts. If you'd like to access a specific account, here are the account credentials that we used: 

```
┌───────────────────┬─────────────────────────┬─────────────────┐
│      Account      │          Email          │    Password     │
├───────────────────┼─────────────────────────┼─────────────────┤
│ Max               │ max@gmail.com           │ ilikemacs       │
│ Eric              │ eric@gmail.com          │ ericiscool123   │
│ Prof. Bonelli     │ ebonelli@stevens.edu    │ bonbon          │
│ Prof. Hill        │ phill@stevens.edu       │ graffixnyc      │
│ Hamzah            │ hamzah@gmail.com        │ hniz1234        │
│ Danny             │ danny@gmail.com         │ dantheman       │
│ Prof. Naumann     │ dnaumann@stevens.edu    │ naumann         │
│ Prof. Borowski    │ borowski@stevens.edu    │ codecode        │
│ Prof. Wellerstein │ wellerstein@stevens.edu │ nukemap         │
│ Prof. Peyrovian   │ reza@stevens.edu        │ iteachatstevens │
│ Prof. Bhatt       │ bhatt@stevens.edu       │ pumpinglemma    │
└───────────────────┴─────────────────────────┴─────────────────┘
```

# Class Credentials
Also in the database are classes with posts and comments. These are the codes and passwords needed to join a class if you are a student.
```
┌─────────┬─────────────────────────────────────────────┬───────────┐
│  Class  │                    Code                     │ Password  │
├─────────┼─────────────────────────────────────────────┼───────────┤
│ CS-115  │ CS115-Introduction To Computer Science-5581 │ 9016739   │
│ CS-284  │ CS284- Data Structures-5486                 │ 5184662   │
│ CS-496  │ CS496- Programming Languages-6491           │ 6304324   │
│ CS-511  │ CS511- Concurrent Programming-5929          │ 9589284   │
│ CS-546  │ CS546- Web Programming I-8727               │ 5726663   │
│ CS-554  │ CS554- Web Programming II-9849              │ 8564529   │
│ CS-385  │ CS385- Algorithms-699                       │ 111963    │
│ CS-115  │ pythoniscool                                │ ilovecode │
│ HST-415 │ 1319                                        │ 3062359   │
│ CS-546  │ CS546- Web Programming I WS-7125            │ 4827026   │
│ CS-347  │ CS-347                                      │ 1234567   │
│ CS-135  │ CS-135                                      │ 54321     │
└─────────┴─────────────────────────────────────────────┴───────────┘
```
As you can see from CS-115 onwards, some of the class codes and class passwords don't follow the pattern set up by their predecessors. This is not due to the code generation of codes and passwords being any different, rather it was manual intervention by developers who changed it temporarily to make it easier to remember their class codes and passwords and never bothered to fix it.

# Authors
Max Shi, Hamzah Nizami, Daniel Kimball, Eric Altenburg
