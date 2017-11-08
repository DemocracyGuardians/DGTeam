
module.exports = {
  title: 'Introducing Trustworthiness',
  screens: [
    {
      type: 'LessonConfirmVow',
      title: 'Vow',
      content: 'I vow to be honest and trustworthy in all my activities with this organization.'
    },
    {
      type: 'LessonMultipleChoice',
      title: 'Pop Quiz',
      content: {
        questions: [
          {
            q: 'Which of the following are not necessarily true about trustworthy people?',
            choices: [
              'They are honest.',
              'They are dependable.',
              'They have similar political beliefs as me.',
              'They search for all possible solutions and evaluate them objectively before making a decision or formulating an opinion.',
              'They recognize their own limitations and avoid offering judgments on things on which they have limited understanding.'
            ],
            a: 'c'
          },
          {
            q: 'Which of the following are not necessarily true about trustworthy people?',
            choices: [
              'They are honest.',
              'They are dependable.',
              'They have similar political beliefs as me.',
              'They search for all possible solutions and evaluate them objectively before making a decision or formulating an opinion.',
              'They recognize their own limitations and avoid offering judgments on things on which they have limited understanding.'
            ],
            a: 'c'
          }
        ]
      }
    },
    {
      type: 'LessonTrueFalse',
      title: 'Pop Quiz',
      content: {
        questions: [
          {
            q: 'Most people trust that the sun will rise in the morning and set in the evening.',
            a: true
          },
          {
            q: 'A Gallup poll shows that we tend to trust doctors and nurses for our medical needs.',
            a: true
          },
          {
            q: 'Most people believe everything they hear from politicians and auto sales people.',
            a: false
          },
          {
            q: 'We generally trust our fire services, police, and EMTs to help us in emergencies.',
            a: true
          }
        ]
      }
    },
    {
      type: 'LessonProse',
      title: 'Trust makes our lives more efficient',
      content: `
        <p>Our trust in someone or something is our belief in the likelihood that a desired outcome will actually happen. For example, we trust that the Earth will continue to rotate around the sun, and we trust our cell phones to accurately give us the date and time. On the human side, even if we drive defensively, we trust that drivers stopped at a red light will wait for their light to turn green before entering the intersection. In commerce, we trust Starbucks to deliver a particular beverage quality and ambience no matter where in the world we find a store. In the West, we trust the government in various ways even if we are naturally cynical, such as trusting the fire department to come in case of fire.</p>

        <p>Without trust, life would be much less convenient and more stressful. Suppose we could not trust that interstate highways are safely maintained – e.g., suppose those highways were often full of potholes and various forms of metal debris. Then, driving would be highly stressful and traffic would slow to a crawl. Fortunately, in reality, the government is highly trustworthy in maintaining the interstates, so we feel confident as we drive fast.</p>
`
    },
    {
      type: 'LessonProse',
      title: 'Examples of people we tend to trust',
      content: `
        <p>On the previous page, we said trust in someone or something is <em>our belief in the likelihood that a desired outcome will actually happen</em>. There are countless
        examples in modern life where we are able to trust others with a
        very high probability that the trusted person or organization will
        deliver the results we expect: </p>

        <ul>
        <li>Gallup polling shows that we trust nurses,
        pharmacists and medical doctors</li>
        <li>We
        trust engineers to design safe bridges, roads and
        airplanes</li>
        <li>We
        trust our judges, juries and court workers to follow court
        procedures properly</li>
        <li>We
        trust our fire services, police, and EMTs to help us in emergencies
        (exception: in America, the Black Lives Matter <sup><a id="ref_4" href="EndNotes.xhtml#note_6_4">[4]</a></sup> movement shows that not everyone trusts the
        police)</li>
        <li>We
        trust religious leaders to honor their faith and religious
        vows</li>
        <li>Generals trust that their soldiers will follow
        all orders to the best of their abilities</li>
        <li>In
        many countries, we trust special financial services professionals,
        called fiduciaries, to always act honestly with only the
        client&#8217;s best interests in mind</li>
        <li>We
        trust notary publics to faithfully witness signatures on
        documents</li>
        </ul>
`
    },
    {
      type: 'LessonProse',
      title: 'We also put a degree of trust in crowd-sourced social media',
      content: `
        <p>In the age of the Internet and social media, we trust people we don’t know all of the time. When we are deciding on which restaurant to go for dinner, we often rely on restaurant reviews written by unknown people. When we bid on something at an auction site, we look at seller ratings from people we don’t know to decide whether the promise of a bargain is worth the chance the seller is dishonest. When we need to learn about an unfamiliar topic, we usually feel we can trust the information we find in the crowd-sourced online encyclopedia Wikipedia, particularly for topics without ideological controversy.</p>
`
    }
  ]
}
