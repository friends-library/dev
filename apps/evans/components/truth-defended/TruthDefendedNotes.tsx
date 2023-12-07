import React from 'react';
import { FIXED_TOPNAV_HEIGHT } from '@/lib/scroll';

const TruthDefendedNotes: React.FC = () => (
  <div id="footnotes" className="space-y-4">
    <Footnote number={1}>Romans 15:4</Footnote>
    <Footnote number={2}>2 Timothy 3:15-17</Footnote>
    <Footnote number={3}>Galatians 1:8</Footnote>
    <Footnote number={4}>
      1 John 5:7. Contrary to the various calumnies of their adversaries, early Friends
      always believed in what Christians call the Trinity. Their only scruple on his point
      had to do with adopting or insisting upon scholastic terms or academic definitions
      (like “three distinct and separate persons or subsistences,” etc.) which are not
      found in Scripture, preferring rather to stick to scriptural words in order to
      express spiritual things.
    </Footnote>
    <Footnote number={5}>Acts 4:12; Isaiah 49:6, Acts 13:47</Footnote>
    <Footnote number={6}>1 Peter 2:21-22, Hebrews 4:15</Footnote>
    <Footnote number={7}>Romans 8:1,34 Timothy 2:5-6, 1 John 2:1-2</Footnote>
    <Footnote number={8}>Acts 10:42</Footnote>
    <Footnote number={9}>Colossians 2:9</Footnote>
    <Footnote number={10}>Ephesians 5:1-2 John 2:2, Hebrews 10:12</Footnote>
    <Footnote number={11}>Romans 5:12,18</Footnote>
    <Footnote number={12}>2 Corinthians 5:19</Footnote>
    <Footnote number={13}>Romans 3:25</Footnote>
    <Footnote number={14}>
      Luke 24:47, Acts 10:43 and 26:20, Ephesians 4:22-24, Romans 8:3-4, 2 Corinthians
      5:15-17, Titus 2:14, John 14:15,21,23-24 and 15:10, 2 Timothy 2:1,19 Peter 4:1-3,
      James 2:12 to the end
    </Footnote>
    <Footnote number={15}>2 Timothy 2:19</Footnote>
    <Footnote number={16}>
      Romans 6:18-19, 22, 2 Corinthians 7:1, Ephesians 4:1,24 Thessalonians 3:13 and 4:7,
      Hebrews 12:1,10,14 John 4:4
    </Footnote>
    <Footnote number={17}>Matthew 5:48</Footnote>
    <Footnote number={18}>Colossians 4:1,12 John 3:3</Footnote>
    <Footnote number={19}>Ephesians 2:8</Footnote>
    <Footnote number={20}>James 2:18 to the end of the chapter</Footnote>
    <Footnote number={21}>Hebrews 11:6, Romans 12:1-2</Footnote>
    <Footnote number={22}>Hebrews 2:9 and 10:12</Footnote>
    <Footnote number={23}>Acts 3:19</Footnote>
    <Footnote number={24}>Acts 26:18-20</Footnote>
    <Footnote number={25}>Matthew 1:21, Acts 3:26, Titus 2:14</Footnote>
    <Footnote number={26}>Genesis 2:17, Romans 5:12</Footnote>
    <Footnote number={27}>Genesis 6:5, Romans 7:5</Footnote>
    <Footnote number={28}>Ephesians 2:2</Footnote>
    <Footnote number={29}>2 Timothy 2:26</Footnote>
    <Footnote number={30}>1 Corinthians 2:14</Footnote>
    <Footnote number={31}>
      1 Corinthians 15:45-47, Ephesians 2:1-5, Colossians 2:13, Romans 8:11, Ephesians
      5:13-14
    </Footnote>
    <Footnote number={32}>John 1:9</Footnote>
    <Footnote number={33}>Ephesians 2:3 and 5:6</Footnote>
    <Footnote number={34}>2 Corinthians 7:10</Footnote>
    <Footnote number={35}>John 1:12-13, Romans 8:14</Footnote>
    <Footnote number={36}>Acts 26:18</Footnote>
    <Footnote number={37}>Colossians 1:13</Footnote>
    <Footnote number={38}>John 8:32-36</Footnote>
    <Footnote number={39}>Mark 3:27</Footnote>
    <Footnote number={40}>Malachi 3:2-3</Footnote>
    <Footnote number={41}>
      Luke 3:16-17, Romans 15:16, John 13:1,8 Thessalonians 5:23, 1 Corinthians 1:2, John
      14:23, Hebrews 13:21, Philippians 2:13
    </Footnote>
    <Footnote number={42}>2 Corinthians 5:17, Ezekiel 36:26</Footnote>
    <Footnote number={43}>Ezekiel 11:19; 36:26</Footnote>
    <Footnote number={44}>Matthew 23:26</Footnote>
    <Footnote number={45}>Hebrews 12:2</Footnote>
    <Footnote number={46}>Hebrews 11:6</Footnote>
    <Footnote number={47}>James 2:18 to the end of chapter</Footnote>
    <Footnote number={48}>Isaiah 35:8-9</Footnote>
    <Footnote number={49}>Revelation 3:20</Footnote>
    <Footnote number={50}>Matthew 23:37</Footnote>
    <Footnote number={51}>Nehemiah 9:20</Footnote>
    <Footnote number={52}>Romans 8:5-8, Genesis 8:21</Footnote>
    <Footnote number={53}>1 Peter 1:23</Footnote>
    <Footnote number={54}>James 1:21</Footnote>
    <Footnote number={55}>Hebrews 4:12</Footnote>
    <Footnote number={56}>John 17:17-19</Footnote>
    <Footnote number={57}>John 3:6</Footnote>
    <Footnote number={58}>Romans 8:14-15</Footnote>
    <Footnote number={59}>
      1 Corinthians 12:3, Romans 8:13 and 6:6, Ephesians 4:22-24, Galatians 5:24,
      Colossians 3:9-10
    </Footnote>
    <Footnote number={60}>Romans 6:4 and 7:6</Footnote>
    <Footnote number={61}>Colossians 3:1-2</Footnote>
    <Footnote number={62}>Romans 13:14</Footnote>
    <Footnote number={63}>
      Isaiah 26:12, Philippians 2:13, Philippians 4:13, John 15:5
    </Footnote>
    <Footnote number={64}>John 15:5,8</Footnote>
    <Footnote number={65}>2 Corinthians 5:17, Galatians 6:15,</Footnote>
    <Footnote number={66}>1 John 2:6. and 3:7-9</Footnote>
    <Footnote number={67}>John 15:4-5</Footnote>
    <Footnote number={68}>Acts 10:34-35, Hebrews 13:21</Footnote>
    <Footnote number={69}>1 Peter 4:18</Footnote>
    <Footnote number={70}>Matthew 5:17-20</Footnote>
    <Footnote number={71}>Romans 3:31 and 8:3-4</Footnote>
    <Footnote number={72}>Isaiah 55:7</Footnote>
    <Footnote number={73}>Romans 6:1-2</Footnote>
    <Footnote number={74}>1 John 1:5-7</Footnote>
    <Footnote number={75}>1 John 2:1</Footnote>
    <Footnote number={76}>1 John 2:1-6</Footnote>
    <Footnote number={77}>1 John 2:13-14</Footnote>
    <Footnote number={78}>John 14:21-23</Footnote>
    <Footnote number={79}>1 Corinthians 12:7</Footnote>
    <Footnote number={80}>Galatians 6:3-4</Footnote>
    <Footnote number={81}>John 3:15-16, Acts 10:43</Footnote>
    <Footnote number={82}>John 14:16-17, 26 and 16:13, Titus 2:11-12</Footnote>
    <Footnote number={83}>1 Corinthians 12:7, John 1:9</Footnote>
    <Footnote number={84}>Matthew 25:14-30</Footnote>
    <Footnote number={85}>Matthew 5:14</Footnote>
    <Footnote number={86}>
      Titus 2:11-12, John 14:17 and 16:7, 8, 13, 14, 1 John 2:27
    </Footnote>
    <Footnote number={87}>John 3:20-21, Ephesians 5:13</Footnote>
    <Footnote number={88}>Genesis 6:5; 8:21</Footnote>
    <Footnote number={89}>John 16:8; John 3:19-21</Footnote>
    <Footnote number={90}>Proverbs 14:13</Footnote>
    <Footnote number={91}>Job 24:13, Ps. 18:28, John 1:2,9 Corinthians 4:4-6</Footnote>
    <Footnote number={92}>
      Romans 1:19-2 Corinthians 4:6, Proverbs 20:27, Luke 24:45, John 1:9, Ephesians
      5:13-14
    </Footnote>
    <Footnote number={93}>
      Ps. 36:9, Proverbs 4:1,18 Corinthians 2:10 to the end of the chapter.
    </Footnote>
    <Footnote number={94}>1 Corinthians 1:20</Footnote>
    <Footnote number={95}>Matthew 11:27</Footnote>
    <Footnote number={96}>Mark 3:24-27</Footnote>
    <Footnote number={97}>Luke 11:21-22</Footnote>
    <Footnote number={98}>1 Corinthians 12:7</Footnote>
    <Footnote number={99}>Ephesians 2:1-3, 12</Footnote>
    <Footnote number={100}>1 Timothy 2:3-4, 2 Peter 3:9</Footnote>
    <Footnote number={101}>Genesis 6:3</Footnote>
    <Footnote number={102}>Luke 19:44</Footnote>
    <Footnote number={103}>2 Corinthians 4:7</Footnote>
    <Footnote number={104}>Mathew 13:31-32</Footnote>
    <Footnote number={105}>Matthew 13:33</Footnote>
    <Footnote number={106}>
      Luke 13:21, Jeremiah 17:10, Romans 8:27, Revelation 2:23, Amos 4:13, Jeremiah
      31:33-34, Ezekiel 36:26-27, Joel 2:28-29, Acts 2:16-18, Isaiah 54:13, Matthew 11:27,
      Isaiah 42:7 and 61:1
    </Footnote>
    <Footnote number={107}>John 14:16,17,26 and 16:13</Footnote>
    <Footnote number={108}>1 John 2:20,27</Footnote>
    <Footnote number={109}>
      John 14:17,20,23 and 17:23, 26, Isaiah 57:15-2 Corinthians 6:16, Proverbs 8:31
    </Footnote>
    <Footnote number={110}>Isiah 57:15</Footnote>
    <Footnote number={111}>Proverbs 8:31</Footnote>
    <Footnote number={112}>John 15:4-5</Footnote>
    <Footnote number={113}>1 Corinthians 6:15,17,19</Footnote>
    <Footnote number={114}>John 6:56-57, 1 John 5:12</Footnote>
    <Footnote number={115}>Romans 10:6-8, 2 Corinthians 13:5, Colossians 2:20</Footnote>
    <Footnote number={116}>Colossians 1:16, Ephesians 1:23 and 3:9</Footnote>
    <Footnote number={117}>Revelation 3:20 and 2:23</Footnote>
    <Footnote number={118}>Acts 17:31, Romans 2:16</Footnote>
    <Footnote number={119}>2 Timothy 4:22; 1 John 4:13</Footnote>
    <Footnote number={120}>1 Corinthians 13:12-9</Footnote>
    <Footnote number={121}>Genesis 3:15</Footnote>
    <Footnote number={122}>1 Thessalonians 5:23</Footnote>
    <Footnote number={123}>Romans 6:11,2,6,7 Peter 1:4</Footnote>
    <Footnote number={124}>Ephesians 4:22-24, Colossians 3:9-10</Footnote>
    <Footnote number={125}>Romans 8:2,4</Footnote>
    <Footnote number={126}>Matthew 5:8, Hebrews 12:14</Footnote>
    <Footnote number={127}>Matthew 12:35</Footnote>
    <Footnote number={128}>2 Peter 1:4</Footnote>
    <Footnote number={129}>Colossians 3:10-11;</Footnote>
    <Footnote number={130}>2 Peter 1:3</Footnote>
    <Footnote number={131}>Titus 2:11-12, Philippians 2:12-13</Footnote>
    <Footnote number={132}>Matthew 26:41</Footnote>
    <Footnote number={133}>2 Corinthians 12:9</Footnote>
    <Footnote number={134}>Ps. 145:9</Footnote>
    <Footnote number={135}>Ezekiel 33:11 and 18:23</Footnote>
    <Footnote number={136}>
      John 3:14-17, Isaiah 55:1, Revelation 22:17, Romans 5:18
    </Footnote>
    <Footnote number={137}>Luke 2:10,14</Footnote>
    <Footnote number={138}>
      Isaiah 55:7, Ezekiel 18:21-22, to the end of the chapter
    </Footnote>
    <Footnote number={139}>Acts 10:34-35</Footnote>
    <Footnote number={140}>1 John 2:2</Footnote>
    <Footnote number={141}>Acts 10:34-35, Hebrews 2:9</Footnote>
    <Footnote number={142}>Titus 2:11</Footnote>
    <Footnote number={143}>1 Corinthians 12:7</Footnote>
    <Footnote number={144}>Proverbs 1:20 to the end of the chapter</Footnote>
    <Footnote number={145}>Acts 7:51</Footnote>
    <Footnote number={146}>Matthew 23:37</Footnote>
    <Footnote number={147}>Nehemiah 9:20,26</Footnote>
    <Footnote number={148}>Isaiah 63:10, Ps. 81:11-13</Footnote>
    <Footnote number={149}>
      Wisdom of Solomon 12:15-16 “Forsomuch then as You are righteous Yourself, You order
      all things righteously: thinking it not agreeable with Your power to condemn him
      that has not deserved to be punished. For Your power is the beginning of
      righteousness, and because You are the Lord of all, it makes You to be gracious unto
      all.”
    </Footnote>
    <Footnote number={150}>Ezekiel 18:23, Wisdom of Solomon 11:23-24</Footnote>
    <Footnote number={151}>Isaiah 45:22</Footnote>
    <Footnote number={152}>Hebrews 2:9</Footnote>
    <Footnote number={153}>John 3:14-16</Footnote>
    <Footnote number={154}>John 12:32; 6:44-45</Footnote>
    <Footnote number={155}>John 3:19-20</Footnote>
    <Footnote number={156}>Ephesians 5:13</Footnote>
    <Footnote number={157}>Ecclesiastes 11:9</Footnote>
    <Footnote number={158}>Ephesians 5:6-7</Footnote>
    <Footnote number={159}>Romans 8:13</Footnote>
    <Footnote number={160}>Proverbs 6:23</Footnote>
    <Footnote number={161}>Galatians 6:8; Romans 8:13</Footnote>
    <Footnote number={162}>1 Timothy 2:3-4</Footnote>
    <Footnote number={163}>Revelation 3:20</Footnote>
    <Footnote number={164}>Luke 13:34, Matthew 23:37</Footnote>
    <Footnote number={165}>Luke 12:48</Footnote>
    <Footnote number={166}>Matthew 25:14-30</Footnote>
    <Footnote number={167}>Revelation 2:3,5:16</Footnote>
    <Footnote number={168}>Matthew 25:1</Footnote>
    <Footnote number={169}>Luke 8:7-8, 14-15</Footnote>
    <Footnote number={170}>1 Corinthians 9:27</Footnote>
    <Footnote number={171}>John 15:1-2, 5-6</Footnote>
    <Footnote number={172}>John 15:10</Footnote>
    <Footnote number={173}>1 John 1:3,9:6-9</Footnote>
    <Footnote number={174}>Matthew 3:2, Acts 17:30</Footnote>
    <Footnote number={175}>Romans 1:18</Footnote>
    <Footnote number={176}>Matthew 23:25-26 and 3:10</Footnote>
    <Footnote number={177}>Hebrews 9:9</Footnote>
    <Footnote number={178}>
      Matthew 5:21-22; 5:27-28, etc. 2 Corinthians 10:5, James 1:14-15
    </Footnote>
    <Footnote number={179}>Matthew 3:11-12</Footnote>
    <Footnote number={180}>1 John 3:8</Footnote>
    <Footnote number={181}>1 Peter 3:21</Footnote>
    <Footnote number={182}>Ephesians 4:5, Romans 6:3,6-8, 11</Footnote>
    <Footnote number={183}>Zechariah 13:1; John 13:8</Footnote>
    <Footnote number={184}>1 Corinthians 6:11</Footnote>
    <Footnote number={185}>John 3:30</Footnote>
    <Footnote number={186}>
      i.e. temple ceremonies, washings, circumcision, purification rites, physical
      separation from Gentles, anointing with oil, avoiding blood and meat that had been
      strangled, etc.
    </Footnote>
    <Footnote number={187}>Romans 14:17</Footnote>
    <Footnote number={188}>1 Corinthians 4:20</Footnote>
    <Footnote number={189}>
      Galatians 5:2; Colossians 2:16-17, 22; Hebrews 9:9-10
    </Footnote>
    <Footnote number={190}>Acts 16:3; 21:20-28</Footnote>
    <Footnote number={191}>1 Corinthians 9:20</Footnote>
    <Footnote number={192}>1 Corinthians 1:14</Footnote>
    <Footnote number={193}>1 Corinthians 1:17</Footnote>
    <Footnote number={194}>Acts 26:18; Colossians 1:13</Footnote>
    <Footnote number={195}>John 6:51,56</Footnote>
    <Footnote number={196}>John 14:20,23</Footnote>
    <Footnote number={197}>1 Peter 2:2-3</Footnote>
    <Footnote number={198}>2 Peter 3:18</Footnote>
    <Footnote number={199}>Revelation 3:20</Footnote>
    <Footnote number={200}>Ephesians 5:30</Footnote>
    <Footnote number={201}>John 15:5</Footnote>
    <Footnote number={202}>Exodus 16:21</Footnote>
    <Footnote number={203}>John 4:14</Footnote>
    <Footnote number={204}>Acts 17:28</Footnote>
    <Footnote number={205}>
      John 13:4-15. Which outward washing could also have been regarded as a lasting
      outward ordinance; for the words of Christ were: “If I then, your Lord and Teacher,
      have washed your feet, you also ought to wash one another’s feet. For I have given
      you an example, that you should do as I have done to you.”
    </Footnote>
    <Footnote number={206}>Acts 15:20,29</Footnote>
    <Footnote number={207}>James 5:14-15</Footnote>
    <Footnote number={208}>Galatians 5:19-24</Footnote>
    <Footnote number={209}>Ephesians 5:9</Footnote>
    <Footnote number={210}>1 John 3:10</Footnote>
    <Footnote number={211}>Romans 8:14-9</Footnote>
    <Footnote number={212}>Romans 12:9</Footnote>
  </div>
);

export default TruthDefendedNotes;

const Footnote: React.FC<{ number: number; children: React.ReactNode }> = ({
  number,
  children,
}) => (
  <div className="relative flex items-start">
    <span
      id={`note-${number}`}
      className="absolute"
      style={{
        height: `${FIXED_TOPNAV_HEIGHT}px`,
        top: `calc(0px - ${FIXED_TOPNAV_HEIGHT}px - 0.5em)`,
      }}
    />
    <a
      href={`#src-${number}`}
      className="text-flprimary font-bold flex-shrink-0 w-12 text-right pr-3 leading-none pt-1 -mt-px"
    >
      {number}.
    </a>
    <div className="flex flex-grow">
      <span className="leading-tight text-black">
        {children}
        <a
          className="text-flprimary pl-2 *bg-red-200 inline-block transform translate-y-1"
          href={`#src-${number}`}
        >
          ↩
        </a>
      </span>
    </div>
  </div>
);
