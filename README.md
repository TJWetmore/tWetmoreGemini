# twetmoreGeminiJobCoin

Hey Gemini Team, 

This was a cool project, I had a fun time with it. As I step back there are definitely places that I would refactor. 

I used a basic Expo set-up to save time. Yes, there's overhead. 

**Objectives:** 

Page 1: Log in Screen. 
- The API never sends a 404 code so I had to do rudimentary authentication via the transactionhistory.length. *To refactor*: the API, unless I'm misreading the prompt, that could send a 404 for an unknown user at the login point.  
- I also send the user's data to the Account screen ahead of rendering the screen via the parameters. 
- I also added a bit of a timeout prior to loading the Account page. This is for the UX... I want my users to think something secure is happening in the background. If that transition is too quick, it could raise eyebrows (I'd want to A/B test tho). 

Page 2: Account Screen
- Displays job coin balance, a chart with the account balance over time, and a window to send coins to other users. 
- The little algo I wrote for parsing the JSON data into something the chart can read works pretty well. But I'm a little dependent on assuming that transactions are stored linearly. They should be given that it's an array. *To refactor* I would throw in a line of code that sorts that data just to be sure. BUT if I'm guaranteed not to have that issue because it is an array, sorting can hurt my time complexity. 
- I'm using react-native-chart-kit to display transaction history over time. *To refactor*: I think I would have created splices of the transaction history so the user could see the past day, past week, past month, etc. Isn't technically that challenging but a little out of scope. I am so open to suggestions on other libraries for charts in React Native. 
- Then there's two textinputs for sending data, specifying the sendee and then the amount. *To refactor*: need to add logic to ensure a user doesn't try to send more job coins than they have. 

Page 3: Send JC loading screen
- I just created a separate screen that shows that the transaction is loading and then gives a thumbs up upon completion. I did this because I wanted to lock the user out from taking any actions as the transaction is processed. I also wanted to give a sense of security. 


**The bug:** 
- The chart doesn't update on the Account page after we return from the Send JC loading screen. It probably isn't the hardest bug to crack, there's probably just some async issues. 

**Also note:**

- I think the functions should be abstracted out. I am not adhering to DRY principles by having the same function across multiple pages. 

- I like the idea of Detox, as I really enjoy E2E testing. I think it is fun. But I'm better at Cypress and so I spent a bit of time trying to read up on setting up Detox. It's not the best framework. But would be fun to contribute too the OS project. 
