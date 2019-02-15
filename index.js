/* Match making for the student placement in an interview cell of a college.
Here we are assuming the every student would priorities their company preferences (All the companies).
In turn Companies priorities their student preferences, that should be atleast one.
*/

// List of students with their preferences for companies;
let studentsList = {
    's1': ['c2', 'c4', 'c1', 'c5', 'c3'],

    's2': ['c3', 'c2', 'c4', 'c1', 'c5'],

    's3': ['c1', 'c2', 'c4', 'c5', 'c3'],

    's4': ['c3', 'c1', 'c5', 'c2', 'c4'],

    's5': ['c5', 'c2', 'c1', 'c4', 'c3'],
}

//List of companies with preferences of students.
let companyList = [{
        name: 'c1',
        pref: ['s3', 's1', 's4']
    },
    {
        name: 'c2',
        pref: ['s2', 's3', 's4']
    },
    {
        name: 'c3',
        pref: ['s2', 's1']
    },
    {
        name: 'c4',
        pref: ['s1', 's4', 's5', 's2', 's3']
    },
    {
        name: 'c5',
        pref: ['s5', 's2', 's1']
    }
];

/*
An Object to maintain a stack of students 
for interview with respect to the company. 
(Based on company priority and Student Priority.)
*/
let companyInterviewStack = {};


/* 

This method below can be improved with more time I guess. Right now it has O(n^2) complexity I presume. 

An Object to maintain the already engaged students with another companies.
Based on the engagement or non engagment, we will see students preferences for the company.

If student is not engaged, our program will assigned to the company on FIFO basis.

If student is already engaged with another company, our program will look for student,
Company preferences, if student have higher preference for existing hookup, then there is no change,
else more deserving company is assigned to the student.
*/
let studentEngagementStore = {};

companyList.forEach(company => {
    let companyName = company.name;
    company.pref.forEach(student => { // Iterate through all the companies preferences.


        /*
            Checks if student is already engaged.
            if No, we simple push the student into the current company interview stack.
        */
        if (studentEngagementStore[student]) {

            // Here we fetch preference of the student for the current company. 
            //(preference= company index in the StudentList)
            let studentPreferenceForCompany = studentsList[student].indexOf(companyName);

            // Here we fetch company preference of the student for which she is already engaged . 
            //(preference= company index in the studentEngagementStore)
            let studentPreferenceForAlreadyEngagedCompany = studentsList[student].indexOf(studentEngagementStore[student]);


            /* 
                Here we are checking if the current company is more preferred by student then the already associated company.
                If Yes, we change the interview stack.
                Else we do nothing, and move forward.
            */
            if (studentPreferenceForCompany > -1 && studentPreferenceForAlreadyEngagedCompany > studentPreferenceForCompany) {

                //Check if interview stack is already present, if not create new, else push student in the existing one.
                if (companyInterviewStack[companyName])
                    companyInterviewStack[companyName].push(student);
                else
                    companyInterviewStack[companyName] = [student];

                //Here we are removing the student from the less deserving company interview stack, as it is now moved to more deserving one.
                let interviewStackStudentIndex = companyInterviewStack[studentEngagementStore[student]].indexOf(student);
                companyInterviewStack[studentEngagementStore[student]].splice(interviewStackStudentIndex, 1);

                //Reset the student enagement store.
                studentEngagementStore[student] = companyName;
            }

        } else {
            //Push student into the company interview stack.

            studentEngagementStore[student] = companyName;
            if (!companyInterviewStack[companyName])
                companyInterviewStack[companyName] = [student];
            else
                companyInterviewStack[companyName].push(student);
        }
    })
});


/* For logging out in a time frame format */

//Find Max Set of student interview in a company;
let maxRounds = 0;
for (let company in companyInterviewStack) {
    if (companyInterviewStack[company].length > maxRounds)
        maxRounds = companyInterviewStack[company].length;
}

for (let i = 0; i < maxRounds; i++) {
    console.log('\n')
    let time = i;
    console.log(`******Round ${i}******\n`);
    for (let company in companyInterviewStack) {
        console.log(`${company} : ${companyInterviewStack[company][i] ? companyInterviewStack[company][i] : "No Candidate"} \n`);
    }
}