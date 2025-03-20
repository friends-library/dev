import React from 'react';
import { notFound } from 'next/navigation';
import type { NextPage, Metadata } from 'next';
import Footnotes from './Notes';
import { MdxH2, MdxH3, MdxLead, MdxP } from '@/components/mdx';
import WhiteOverlay from '@/components/core/WhiteOverlay';
import BooksBgBlock from '@/components/core/BooksBgBlock';
import { FIXED_TOPNAV_HEIGHT } from '@/lib/scroll';
import * as seo from '@/lib/seo';
import { LANG } from '@/lib/env';

const Page: NextPage = async () => (
  <div>
    <BooksBgBlock>
      <WhiteOverlay>
        <h1 className="heading-text text-2xl sm:text-4xl bracketed text-flprimary">
          <>What Early Quakers Believed</>
        </h1>
      </WhiteOverlay>
    </BooksBgBlock>
    <div className="MDX p-10 md:px-16 lg:px-24 body-text max-w-6xl mx-auto mt-4">
      <MdxLead>
        For nearly 200 years, the early Society of Friends (Quakers) held precisely the
        same doctrines, principles, and practices as their worthy founders (who often
        declared their Christianity to be nothing more than a return to the principles and
        practices of the primitive church). It was not until the middle of the 19th
        century, when the great majority of the Quakers had become children of tradition,
        rather than true “sons of light,” that a combination of dead formality and human
        ambition (arising under a false banner of “reform”) began to tear the once unified
        society into a state of great disunity and discontent. No longer united by each
        members’ careful submission to the Spirit of Truth, the babel-like result was a
        painful disorder of confusion, division, and animosity, leaving very few humble
        hearts standing on the original foundation.
      </MdxLead>
      <MdxLead>
        The short booklet below (also available in{` `}
        <a className="subtle-link" href="/compilations/truth-defended">
          paperback, ebook, and audio format here
        </a>
        ) was published in 1702 by William Chandler, Alexander Pyot, Joseph Hodges, along
        with some other Friends, who had been slandered and misrepresented by other
        congregations in their area. Many doctrinal works have been published by Friends
        to explain and defend their doctrinal stances on a variety of points (See
        particularly the{` `}
        <a className="subtle-link" href="/robert-barclay/apology">
          Apology
        </a>
        {` `}
        of Robert Barclay,{` `}
        <a
          className="subtle-link"
          href="/joseph-phipps/original-and-present-state-of-man"
        >
          The Original and Present State of Man
        </a>
        , by Joseph Phipps, and{` `}
        <a className="subtle-link" href="/isaac-penington/writings-volume-1">
          The Writings of Isaac Penington
        </a>
        ). But perhaps no publication of the Society of Friends has so clearly and
        succinctly described their beliefs on such a wide variety of subjects, nor
        defended them them with such clarity and candor, using a multitude of Scripture
        citations.
      </MdxLead>
      <MdxH2 id="introduction">Introduction</MdxH2>
      <MdxP>
        It is not that we love contention, or desire controversy, or are impatient in
        bearing reproaches, that we now print this short treatise; but such have been the
        repeated high charges, and severe lashes that our adversaries have bestowed upon
        us, that we find ourselves concerned to clear and vindicate the truth and
        innocence of our Christian profession. We therefore desire our well-disposed
        neighbors to candidly weigh what we have to allege, and to receive an account from
        ourselves concerning what we are, and what we believe and hold for Christian
        truths; for certainly we know our own beliefs better than those who perhaps have
        never examined them for any other purpose than to find fault.
      </MdxP>
      <MdxH2 id="scriptures">Concerning the Holy Scriptures</MdxH2>
      <MdxP>
        We hope that you will not think it strange that we do not express our belief in
        some particulars in the scholastic terms of other professors of Christianity, but
        find it more reasonable and safe to content ourselves with the language that the
        Holy Spirit thought fit to hand to us in the Holy Scriptures—those most excellent
        and divine writings, which above all others in the world, call upon our reverence
        and most diligent reading; those oracles of God, and rich Christian treasury of
        divine saving truths, which were written for our learning, that “we through
        patience and comfort of them may have hope.”
        <Footnote number={1} />
        We believe that the Scriptures are profitable for doctrine, reproof, correction,
        and instruction in righteousness, to the perfecting and thoroughly furnishing of
        the man of God to every good work, making him wise unto salvation through faith
        which is in Christ Jesus;
        <Footnote number={2} />
        containing all Christian doctrines necessary to be believed for salvation, and are
        a sufficient external standard and touchstone to try the doctrines of men. And we
        say with the apostle, that whosoever shall publish and propagate any other gospel
        and faith than what is therein testified to us by those inspired pen-men who were
        the first promulgators thereof, though he were an angel, let him be accursed.
        <Footnote number={3} />
        All and whatsoever is contained therein, we as firmly believe as any of you do;
        and as it is the duty of every sincere Christian, we are heartily thankful to God
        for them, who through His good Providence has preserved them to our time, to our
        great benefit and comfort.
      </MdxP>
      <MdxH2 id="three">Concerning God — Father, Son and Spirit</MdxH2>
      <MdxP>
        We believe in the great omnipotent God that made and created all things and gave
        us our being, whom in sincerity of heart we fear, reverence and worship, being
        seriously concerned for our souls’ welfare to eternity. We believe that great
        mystery that there are three who bear record in Heaven, the Father, Son, and Holy
        Spirit, and that these three are one in being and substance.
        <Footnote number={4} />
        And just as do you, so we also do hope for and expect salvation only and alone
        through the Son of God, our blessed Lord and Savior Jesus Christ of Nazareth;
        believing that God the Father has ordained Him for salvation to the ends of the
        earth, and that no other Name is given under heaven by which men shall be saved.
        <Footnote number={5} />
        We believe also that He was conceived by the Holy Spirit, in the womb of the
        virgin Mary, was born of her at Bethlehem, lived a holy and exemplary life,
        perfectly free from sin.
        <Footnote number={6} />
        We believe in His doctrines, miracles, sufferings, and death upon the cross,
        outside the gates of Jerusalem; His resurrection from the dead, and ascension into
        heaven, where He is at the right hand of God the Father, perfect God and perfect
        man, the only mediator between God and man, and is our advocate with the Father,
        who ever lives to make intercession for us;
        <Footnote number={7} />
        and also shall judge both living and dead.
        <Footnote number={8} />
        All of this, and whatsoever else is recorded of Him in the sacred Scriptures, we
        firmly believe.
      </MdxP>
      <MdxP>
        This Jesus, in whom dwelt the fullness of the God-head,
        <Footnote number={9} />
        we believe offered up Himself according to the will of the Father, an acceptable
        sacrifice to God, and became a propitiation for the sins of mankind, to the end of
        the world.
        <Footnote number={10} />
        We believe He died for all men, as all died in Adam;
        <Footnote number={11} />
        through whose blood God proclaims redemption and salvation to man, and offers to
        be reconciled, and freely for His Son’s sake to remit,
        <Footnote number={12} />
        forgive and pass by all past offenses to as many as shall truly and heartily
        repent of their sins,
        <Footnote number={13} />
        and turn from the same, and shall so believe in our Lord Jesus Christ, and love
        Him for the future, to live a holy circumspect Christian life, and obey His
        commands, thereby continuing in His love.
        <Footnote number={14} />
      </MdxP>
      <MdxH2 id="perfection">
        Departing from Iniquity, and the Doctrine of Perfection
      </MdxH2>
      <MdxP>
        This holy life was so much celebrated and strictly kept to in the primitive ages
        of Christianity, that “whosoever named the name,” or took the name of Christ upon
        them understood that they “were to depart from iniquity,”
        <Footnote number={15} />
        and we believe this ought to be inseparable from any true and faithful Christian,
        as that which ever accompanies a true living and active faith. And though our
        opposers have scoffed at us, and branded us with error for holding the possibility
        of perfection, because in pleading for a holy righteous life as that which is
        well-pleasing to God, and affirming His power to be stronger in man (as man
        cleaves to it, and believes to be rescued from under the power of Satan) than that
        of the devil to retain him in bondage,
        <Footnote number={16} />
        we have sometimes made use of the words of Christ and His apostles, as “Be perfect
        as your Father which is in Heaven is perfect,”
        <Footnote number={17} />
        and “He that has this hope in him, purifies himself even as He is pure,” etc.
        <Footnote number={18} />
        Yet we have never pretended to a moral perfection beyond what is contained in the
        above Scripture promises, which are sound and true in themselves, and are clearly
        what God desires and requires of us; and it is for this reason that we frequently
        press its necessity, and fervently exhort people to its performance.
      </MdxP>
      <MdxH2 id="grace-and-works">
        Salvation by Grace, but Works a Constant Companion
      </MdxH2>
      <MdxP>
        And notwithstanding we have from here been falsely accused that we expect to be
        saved by our <em>own</em> works as being meritorious, yet we do not acknowledge a
        holy life as the efficient and procuring cause of our salvation; which we totally
        refer to the free grace and mercy of God in Christ without any merit in man;
        <Footnote number={19} />
        though we esteem good works as a constant companion thereto, and a necessary
        condition on our part in compliance with God’s gracious offer,
        <Footnote number={20} />
        without which we may not obtain it, being inseparably annexed to that faith which
        only pleases God, and is but our reasonable duty.
        <Footnote number={21} />
      </MdxP>
      <MdxH2 id="historical-belief">
        Historical or Traditional Belief Not Sufficient
      </MdxH2>
      <MdxP>
        And while we believe that although Christ thus offered up Himself once for all,
        for the sins of all men to the end of the world,
        <Footnote number={22} />
        thereby rendering repentance and amendment of life prevailing with God; yet a mere
        traditional or historical belief in that alone is not sufficient to entitle us to
        that common salvation that comes by Him, but that it is of necessity that we truly
        repent and be converted from the evil to the good.
        <Footnote number={23} />
        It is therefore no less necessary for us now than it was for believers in the
        apostles’ days, that we be “turned from darkness to light,” or in other words,
        from the dark power of Satan, to the power of God who is light,
        <Footnote number={24} />
        that thereby we may each know the work of redemption and salvation wrought in and
        for ourselves. For it is not enough to believe that Christ died, if we experience
        not the blessed effects of His death, who came to save us from our sins (not in
        them), and bless us by turning us from our iniquities, and gave Himself for us
        that He might “redeem us from all iniquity, and purify unto Himself a peculiar
        people zealous of good works.”
        <Footnote number={25} />
      </MdxP>
      <MdxH2 id="fallen-condition">Man’s Fallen Condition, and Need of New Life</MdxH2>
      <MdxP>
        For we believe such to be the natural state of man in the fall, that by nature we
        are dead to God,
        <Footnote number={26} />
        at a distance from Him, prone to evil and to gratify the desires of our sensual
        minds, swayed by the corrupt and sinful lusts of the flesh,
        <Footnote number={27} />
        and under the power of a strange king, ruled by the prince of the power of the
        air,
        <Footnote number={28} />
        so that as our inward man is thus dead to God, we cannot exercise our spiritual
        senses towards Him,
        <Footnote number={29} />
        nor can this natural man perceive, know, or savor the things of God, which only
        are spiritually discerned.
        <Footnote number={30} />
        Therefore, notwithstanding our Savior died for us, we are yet by nature in a
        miserable and undone condition, in captivity to our souls’ enemy, unless we
        experience the second Adam, the Lord from heaven, that live-giving Spirit, to
        quicken our souls and make us alive to God again,
        <Footnote number={31} />
        so that, being restored to the use of our inward senses, we may by the assistance
        of His Divine Light (with which, for that end, He has blessed all the sons and
        daughters of men
        <Footnote number={32} />
        ) come to see ourselves in this sad and lost state under the wrath of God,
        <Footnote number={33} />
        and abhor ourselves therefore, and under this living sense (wherein things appear
        with a very different aspect than before) can cry out to God for deliverance
        therefrom, with such and inward heartfelt sorrow as works a true repentance for
        the same.
        <Footnote number={34} />
      </MdxP>
      <MdxH2 id="salvation-by-christ">Salvation by Christ</MdxH2>
      <MdxP>
        It is not our being sprinkled when infants that will make us true Christians, or
        convert us from being children of wrath to become children of grace, sons of God,
        members of Christ’s church, and give us an inheritance in Him.
        <Footnote number={35} />
        It is not learning our catechism and subscribing to certain articles of faith
        (however orthodox), or being educated in a historical belief of what Christ did
        for us more than sixteen hundred years ago. No, this will not administer a
        sufficient, true, and saving knowledge of Christ, nor give us a real share in His
        death and sufferings; for people may talk of and please themselves with all of
        this, and yet continue entirely bound under the dominion of Satan (who still rules
        wherever disobedience is). But the true and saving knowledge of Christ is to
        experience ourselves turned from darkness to light, from the power of Satan to the
        power of God,
        <Footnote number={36} />
        that by Him we may be delivered from the power of darkness, be translated into the
        kingdom of His dear Son,
        <Footnote number={37} />
        to experience His saving power really to rescue and redeem us out from under the
        power of him that has enslaved us
        <Footnote number={38} />
        and leads captive at his will those who live in the vanity of their minds. Yes, it
        is to experience Christ bind this strong man, to spoil his goods, dispossess, and
        cast him out;
        <Footnote number={39} />
        to feel Christ sit in the soul as a refiner who burns up, consumes, destroys,
        purifies and thoroughly purges out whatsoever is contrary to Him;
        <Footnote number={40} />
        to wash us and make us clean that we may have right to an inheritance in Him, that
        being cleansed and sanctified He may take up His abode with us, exercise His
        kingly power, and work in us both to will and to do of His good pleasure.
        <Footnote number={41} />
      </MdxP>
      <MdxP>
        The mind being thus disentangled, and having cast off its former yoke, old things
        are then done away, and all things become new
        <Footnote number={42} />
        —a new tender “heart of flesh”
        <Footnote number={43} />
        according to the promise, new thoughts, desires, inclinations, affections, words,
        actions, a new inside producing a new outside, even a thoroughly new creature in
        Christ,
        <Footnote number={44} />
        who is really entitled to those benefits that accrue to men through Him, by that
        living faith which He begets,
        <Footnote number={45} />
        which pleases God,
        <Footnote number={46} />
        gives victory,
        <Footnote number={47} />
        and is ever fruitful to Him in good works. And we believe that it is that most
        precious sacrifice which Christ offered up when His blood was shed upon the cross
        for us, <em>together with</em> this inward work of redemption and regeneration
        thus wrought in the soul by Jesus Christ, that completes the salvation of all who
        have been thus awakened, made alive, and set free by the power and Spirit of Him
        who is the way, the truth, and the life of every soul that truly lives unto God;
        for these are empowered to walk in that holy way of life, truth, and peace that
        was prepared of old for the ransomed and redeemed to walk in.
        <Footnote number={48} />
      </MdxP>
      <MdxH2 id="condemnation">Man’s Condemnation is of Himself</MdxH2>
      <MdxP>
        And we believe that God graciously waits with exceeding great kindness and
        long-suffering, that men may repent, knocking at the door of every man’s heart,
        <Footnote number={49} />
        freely offering, but not imposing, His assistance
        <Footnote number={50} />
        in this most important work and change in the hearts of men; so that in the day
        wherein God will judge the world by Jesus Christ, and every secret thing will be
        made manifest, God will be justified and clear of the blood of all men. Indeed,
        then every mouth will be stopped, and every man’s condemnation will be of himself
        for having rejected the day of his visitation, wherein God calls to man and offers
        to be reconciled to him for resisting the strivings, and slighting the reproofs of
        His Spirit, which in matchless mercy He has given man to instruct him, and to show
        and lead him in the way of life and peace.
        <Footnote number={51} />
      </MdxP>
      <MdxH2 id="regeneration">Experiential Regeneration or New Birth</MdxH2>
      <MdxP>
        We believe, that though the depravity of man’s nature in the fall is such that the
        natural or carnal man (who is enmity against God in the state of mere nature)
        minds only the things of the flesh, and naturally brings forth the works thereof,
        and cannot please God, nor keep or observe His laws, but is prone to evil;
        <Footnote number={52} />
        yet those who embrace the visitation of God, and are really regenerated and born
        again of incorruptible seed, by the Word of God that lives and abides forever,
        <Footnote number={53} />
        that ingrafted Word
        <Footnote number={54} />
        that is living and powerful
        <Footnote number={55} />
        and able to save and sanctify the soul,
        <Footnote number={56} />
        are born into a new life, and invested with another and higher power, and become
        spiritually minded, and by the Spirit are set at liberty to walk according to the
        Spirit
        <Footnote number={57} />
        and bring forth its fruits. These receive an ability from the Spirit to serve God
        acceptably, being now led by the Spirit of God and become His children, who are
        taught of Him, and through the Spirit of adoption received into their hearts
        <Footnote number={58} />
        have a right to call God their Father, and Jesus their Lord. For having through
        the Spirit mortified the old man or first nature, with his corrupt and depraved
        inclinations and evil deeds, and put him off, and having crucified the flesh with
        the affections and lusts thereof, they put on the new and heavenly man, which
        according to God is created in righteousness and true holiness.
        <Footnote number={59} />
        And these being renewed in the spirit of their minds, they now walk in newness of
        life,
        <Footnote number={60} />
        and are really in Christ, and therefore are changed and become new creatures, and
        now think and act under the leadership of a Spirit superior to that which formerly
        governed them, having their minds raised to a region above that of fallen nature,
        so that now the stream of their thoughts, desires and actions, flows in another
        current, and the bent of their affections are after those things that are above,
        where Christ is;
        <Footnote number={61} />
        for an eye is now opened in them that sees more transcendent beauty and
        desirableness in the invisible and durable treasures of Him, than in all the
        transient pleasures that this world can afford.
      </MdxP>
      <MdxP>
        And we believe that whosoever expects to have Christ’s righteousness imputed to
        them, ought thus to put on the Lord Jesus Christ,
        <Footnote number={62} />
        and to be thus clothed upon and covered with His righteousness, and in measure
        have His holy life brought forth in and through them, and experience Him to
        enliven and influence their minds, and to work in and for them. These know that
        without Him they can do nothing, but through Him that strengthens them they can do
        whatsoever He commands them, and as they abide living branches in Him (through
        that sap and virtue which they daily receive from Him), they are made able to
        bring forth fruits that are well-pleasing to God,
        <Footnote number={63} />
        whereby He is glorified.
        <Footnote number={64} />
        For though God the Father accepts us in Christ, and for His sake, yet this
        new-birth is the indispensable qualification, and true distinguishing mark of
        those that are really in Him. “He that is in Christ is a new creature, old things
        are past away, behold all things are become new.”
        <Footnote number={65} />
        John says, “He that says he abides in Him, ought himself also so to walk even as
        He walked.”
        <Footnote number={66} />
      </MdxP>
      <MdxH2 id="grace-and-flesh">
        All is by Grace, but Grace offers no Liberty to the Flesh
      </MdxH2>
      <MdxP>
        We ascribe nothing to man, as having any power or ability in or of himself to
        please God, but rather attribute all power to do what is good to Christ alone,
        <Footnote number={67} />
        in whom alone the Father is well-pleased. It is through Him that men are enabled
        so to love and fear God as to forsake evil and to work that righteousness which is
        acceptable to Him.
        <Footnote number={68} />
        And thus man’s dependence ought daily to be upon Him to receive from Him such
        suitable supplies as, through a constant watchfulness, he may be enabled to
        continue in His favor and enjoy His smiles. For it is not as too many seem to
        imagine, or would gladly have it to be, that they may live in sin and disobedience
        here, indulging their corrupt inclinations; and yet hereafter expect to have
        Christ’s righteousness imputed to them.
        <Footnote number={69} />
        For though we are not under the Mosaic law, so as to be obliged to its ordinances,
        washings, and Levitical priesthood (Christ our high-priest having offered up
        Himself once for all, and fulfilled it); yet we are not under such a grace as
        discharges us from living well. Though we are not tied to the law’s rites and
        ceremonies, yet are we obliged to fulfill its righteousness,
        <Footnote number={70} />
        which Christ came not to destroy but to establish.
        <Footnote number={71} />
        And though God is gracious and merciful to forgive us our trespasses through the
        mediation of Christ upon our true and hearty repentance and sincere turning from
        them;
        <Footnote number={72} />
        yet this is not so that we may take liberty to go on in sin and rebellion against
        Him. To be sure, we are not to sin because God is gracious, in order that His
        grace may abound;
        <Footnote number={73} />
        if so, where is the narrowness of Christ’s way? If we are to take up a daily cross
        to our own wills in order that we may perform His, tell me, what room is there for
        the liberty of the flesh?
      </MdxP>
      <MdxP>
        Those who are truly in Christ (which renders us acceptable to the Father, and
        completely espoused to Him) must necessarily have resigned their wills as an
        effect of true love, an essential part of so near a union; and from this obedience
        necessarily follows. The apostle John, after having stated that God is Light, and
        that those who desire to experience the blood of cleansing and true fellowship
        with Him and one another ought to walk in the Light as He is in the Light,
        <Footnote number={74} />
        tells the young and weak in the faith (whom he calls children) that he wrote these
        things that they should not sin.
        <Footnote number={75} />
        Yet, if any through weakness or inadvertence should sin, and so fall under the
        Father’s displeasure, he tells them that Christ the righteous is both a
        propitiation and also an advocate that intercedes with the Father. He tells them
        also that their keeping His commands was the surest evidence of their knowing and
        being in Him;
        <Footnote number={76} />
        but with respect to the strong, whom he calls young men, he says that the Word of
        God did abide in them, and that they had overcome the evil one.
        <Footnote number={77} />
      </MdxP>
      <MdxH2 id="profession-vs-possession">
        Profession vs. Possession of Christianity
      </MdxH2>
      <MdxP>
        These things may easily be spoken and comprehended in the understanding, but to
        experience them fulfilled in ourselves is our highest concern, and only this can
        make us sharers in them. The essence of Christianity does not consist in having
        our heads stuffed with knowledge, but to have our hearts filled with divine love,
        which animates and empowers us to diligence, and inspires us with courage and
        power to observe and perform the will of God.
        <Footnote number={78} />
        For God looks not at what people profess with their lips, or by what name they are
        called, but regards the heart, and what spirit governs there. People may make a
        profession of the best things and yet continue alive to themselves. They may alter
        their opinion or persuasion, and yet not turn from darkness to light, and from the
        power of Satan to God.
      </MdxP>
      <MdxP>
        There has indeed been a very large and glittering outward profession of
        Christianity in the world, adorned with artful, elaborate, and elevated notions,
        polished with rhetoric and eloquence; but the power and life that reaches the
        heart and gives victory and dominion over its lusts and affections which war
        against the soul, is that which too many are yet strangers to. Indeed few know
        their fallen souls restored from their first state in Adam, and raised to a state
        where they may both perceive the things of God, receive power to work His will,
        experience their minds redeemed, and know that power vanquished which formerly led
        them captive, having being leavened by the heavenly gift into its own nature. This
        is the very life and marrow of that religion about whose external parts the world
        is filled with noise; and so it is the proper and most necessary business of our
        lives to find this great salvation accomplished in us. The experiential working
        out of this salvation in the heart, by the saving grace and Spirit of God that is
        given to man to profit with,
        <Footnote number={79} />
        will yield more satisfaction and true contentment to the soul that sincerely seeks
        the kingdom of heaven and the righteousness thereof, than to hear or read all
        their days of what God has done in ages past for those that truly loved and feared
        Him. And it is for lack of this that the profession of Christianity is generally
        so empty and barren in producing a truly pious life, attended with the fruits of
        the Spirit, and a due obedience which proceeds from that birth of the Spirit,
        without which the most refined methods of worship and devotion will not recommend
        us to God, who is inaccessible by the birth of the flesh. Nor do we believe that
        it is acceptable to God for people to sing to Him those songs and psalms which
        were the experiences and spiritual exercises of holy men in times past, without
        having some living experience of the same things in themselves; or that people can
        properly and truly speak further of the things of God than what they have known
        and experienced.
        <Footnote number={80} />
      </MdxP>
      <MdxH2 id="gift-of-light">The Gift of Christ’s Light and Spirit in the Heart</MdxH2>
      <MdxP>
        Now, where among all these sound gospel and scriptural truths is to be found that
        “latent venom” so much feared and talked of by our adversaries? Or is it in that
        we hold forth the infinite love of God to mankind, not only in freely (of His mere
        grace and favor) providing a sacrifice through which an atonement is made for the
        past transgressions of man, and which is applicable to everyone who shall believe,
        repent and return;
        <Footnote number={81} />
        but also in that He affords to all the means of faith, repentance and conversion?
        For we believe that God does not require impossibilities of men, but expects they
        should improve the talent or mina distributed to them, not only in sending forth
        the Son of His love to die for their sins that they should not longer live
        therein, but also in sending forth His light and Spirit of truth into their
        hearts, to lead and guide them into all truth. And we read that He causes His
        grace that brings salvation to appear to all men, to instruct and teach them to
        deny all ungodliness and worldly lusts, to forsake the devil and all his works,
        the pomps and vanities of this wicked world, to rescue and save them from living
        in the sinful lusts of the flesh, and help and strengthen them to return in
        obedience, and live a sober, righteous and godly life, to keep God’s holy will and
        commandments, and walk in the same all the days of their lives.
        <Footnote number={82} />
      </MdxP>
      <MdxP>
        The holy Scriptures plentifully testify to this gift from God to man under various
        names, such as Spirit, light, word, grace, seed, leaven, anointing, etc., by all
        of which we understand that Spirit or heavenly talent with which God has endowed
        mankind in some degree that he may profit by it.
        <Footnote number={83} />
        And in the experience of its increase, by a diligent cooperation therewith, in
        order to fulfill those holy ends for which we receive it, we doubt not but to be
        happy in rendering a good account of our stewardship, and entering finally into
        the joy of our Lord.
        <Footnote number={84} />
        Our opposers themselves also claim to have the Spirit and grace of God, or else
        why is there so much praying for its assistance, and those polished discourses
        about it with which they sometimes enthrall their auditory. We charitably hope
        this is more sincere than only to beautify and recommend their sermons to the
        hearers as a subject they cannot well avoid, seeing that the Scriptures are so
        full of that language. But if indeed it be real and sincere, then why is it
        considered a fault and error in us, when it is believed to be so sound and
        appropriate in them?
      </MdxP>
      <MdxP>
        And we think it very strange that they should find any absurdity in granting this
        divine gift to be Christ’s Light shining in the mind; since its proper office is
        to teach and instruct, to manifest and point out our duty, as well as to dispose
        and enable us to perform it, and ought to be our leader and governor. If the godly
        admonitions and exemplary lives of good men were rightly called “lights to the
        world,”
        <Footnote number={85} />
        surely much more properly may this—which is the fountain of light, and does more
        clearly illuminate and inform the understanding and render it effectual—justly
        deserve that acceptable name. And if then the grace and Spirit of God is in the
        hearts of men, surely it is not wholly inactive there, but will be making some
        attempts towards accomplishing the end for which it is placed there.
        <Footnote number={86} />
        It will at times be attacking its enemies, and endeavoring to supplant what is
        contrary; for being holy and pure in nature, it is never reconcilable to sin and
        evil, but ever strives against it, and may (as men heed it) be infallibly known by
        the nature of its endeavors.
      </MdxP>
      <MdxP>
        And we dare appeal even to all mankind whether they do not find something placed
        in their minds and consciences which, though perhaps not governing there, yet
        never mingles with nor consents to their evil deeds, but always remains undefiled
        and testifies against them, convicting, reproving, and condemning them for it, and
        also oftentimes (in the cooler temper of their spirits) manifests their states to
        them?
        <Footnote number={87} />
        Is there not something in all that (as it were) reasons with them, discovering the
        evil of their ways, secretly calling to them to come out of it, begetting desires
        and inclinations sometimes to seek after God and to make their peace with Him? Now
        since man in His mere natural state is totally dead and fallen from God to such a
        degree that he cannot of himself think a good thought;
        <Footnote number={88} />
        and since God is the only essential good, it follows that this gift in us must
        necessarily proceed from Him. This gift of grace or light in us that ever convicts
        us for vice and evil,
        <Footnote number={89} />
        whether in thought word or deed, and disposes us to consider our latter end, and
        often makes men sigh in the midst of laughter,
        <Footnote number={90} />
        —reminding them that they must give an account, drawing them heavenward, and
        inclining them to virtue and goodness, to do unto all men as we would have them do
        unto us, to be just, sober, merciful, temperate, etc.—this must necessarily be
        something that is{` `}
        <em>not of us,</em> but is pure and immaculate and of a divine nature, ever
        aspiring and raising the mind towards its origin.
      </MdxP>
      <MdxP>
        Thus it cannot be a natural light, or the mere “light of nature,” as very many
        claim it to be, who nevertheless often talk of the Spirit of God being in man. For
        it is an undoubted truth that no power can act beyond its own sphere, or raise the
        object that it acts upon to a state more noble than itself, nor produce effects of
        a nature more sublime than its own origin. Besides, it is very clear and evident
        from Scripture that the mind of man is often enlightened by a light
        <Footnote number={91} />
        superior to that of mere reason, and that man by the utmost power and extent of
        human reason and speculation, (though he may arrive to implicit knowledge that
        there is a God, yet) can never attain to a true, spiritual and saving knowledge of
        God without the concurrence of a divine and supernatural power. For though the
        mind of man as a rational being is that capacity or candle that can be
        enlightened, yet it is Christ that must enlighten it
        <Footnote number={92} />
        so as to give us a true discerning of those things that appertain to Him and His
        Kingdom; and by adhering and yielding obedience to its discoveries, we shall know
        an increase of more light. The apostle, speaking of what God by His Spirit had
        revealed to them, says expressly that the Spirit searches all things, yes, even
        the deep things of God; and that as no one knows the things of a man, save the
        spirit of man which is in him, so no man knows the things of God but the Spirit of
        God; and that the natural man neither knows nor receives the things of the Spirit
        of God because they are spiritually discerned, and for that purpose they had
        received the Spirit which is of God.
        <Footnote number={93} />
        The light of nature is occupied with natural objects, with those things that are
        within its own region, acting within its own proper sphere, but it cannot reach to
        that knowledge of God which is life eternal unless our natural powers or human
        capacities are illuminated by the rays of divine light; for, as the apostle says,
        the world by human wisdom knows not God.
        <Footnote number={94} />
        And Christ says very plainly and positively, that no one knows the Father but the
        Son, and he to whom the Son reveals Him.
        <Footnote number={95} />
      </MdxP>
      <MdxP>
        The idea that these strugglings within us are the suggestions of Satan, or that he
        would disquiet and disturb people for their sins, for serving him, or set them
        upon endeavoring to be freed from their subjection to his power, seems absurd to
        imagine. Indeed, our Savior puts this beyond question when He asks, “Can a kingdom
        divided against itself stand?”
        <Footnote number={96} />
        And elsewhere He plainly says, that while the strong man armed keeps the house,
        his goods are at peace, until a stronger than he comes to bind him, etc.
        <Footnote number={97} />
        It is therefore apparent that it is not the devil, but rather the approaches of a
        superior Power that breaks the peace of people for sin, and follows and condemns
        them for disobedience and transgression. And only this supreme Power can, and
        indeed would, redeem their minds out of that miserable state, bind the strong man,
        break his power and cast him out, if they would but join their will thereto, and
        accept deliverance by it.
      </MdxP>
      <MdxH2 id="day-of-visitation">A Day of Visitation Granted to All Men</MdxH2>
      <MdxP>
        Nor does this gift being extended to all men, through all ages from their youth
        upwards, suggest it to be therefore natural or contemptible; but on the contrary,
        this shows it to be of greater importance to all men. For the apostle says “a
        manifestation of the Spirit is given to every man to profit withal,”
        <Footnote number={98} />
        and we know that the blessings and gifts of God are free and valuable because of
        their intrinsic worth. In nature, God ordained nothing in vain, but those things
        that are of greatest use to us for sustaining and accommodating our natural life
        are the more common, such as the sun that gives light to all men through all ages.
        Man evaluates things according to his own fancies, and esteems and prizes them
        more for their rarity and curiosity, rather than their usefulness; but God bestows
        most universally that which is of the most absolute necessity to man. Are we not
        told that all men are born strangers and enemies to God, in darkness and at a
        distance from Him in the state of nature,
        <Footnote number={99} />
        and that they must therefore be enlightened, converted, born again, and made
        spiritual before they can be reconciled to Him? Shall not God then, who desires
        all men to repent and be saved,
        <Footnote number={100} />
        cause the light of the Son of Righteousness to shine upon all and give a measure
        of His grace and Spirit to all, to assist them in the accomplishment of a work in
        themselves which they cannot possibly do of themselves, and yet one that is of
        indispensable necessity to their salvation? Therefore we read that God by His
        Spirit strives with man
        <Footnote number={101} />
        so long as his day of visitation lasts.
        <Footnote number={102} />
      </MdxP>
      <MdxP>
        Since then even our opposers acknowledge the Spirit, light and grace of God to be
        in man, unless they can demonstrate it to be of a manifestly different and
        superior nature, tendency, and operation, and to be distinct or contrary to that
        gift of which we have been speaking, we see neither absurdity nor error in
        concluding it to be one and the same grace and free gift of God offered to all
        which is always the same in its nature, though it differs in its degree; and we
        believe that this is that heavenly “treasure”
        <Footnote number={103} />
        which God has committed to our trust. Blessed will they be who rightly employ it
        and experience its increase, and give place and room to this seed of the kingdom
        in their hearts. And though it may appear at first contrary to the expectations of
        man—seeming little, low and contemptible,
        <Footnote number={104} />
        scarcely regarded among the things with which men’s minds are filled—yet if he
        will but join his will to it, that it may exert its power and force in him, it
        will grow and increase. Indeed, let this leaven have its perfect work, and it will
        leaven the whole lump into its own nature.
        <Footnote number={105} />
      </MdxP>
      <MdxH2 id="christ-in-man">Christ’s Dwelling in Man</MdxH2>
      <MdxP>
        Please consider whether we have justly merited the insults of our adversaries by
        believing that the Lord searches the heart of man, and shows him his thoughts, and
        has not forgotten to be gracious in performing those bountiful promises made in
        times past to the offspring of the Gentiles, in placing His law in our hearts, and
        putting His truth in our inward parts, in pouring out of His Spirit upon all the
        sons and daughters of men, in becoming our Teacher, and giving us the knowledge of
        Himself through the revelation of His Son Jesus Christ, who has come to open our
        blind eyes, and to bring us, who were bound in darkness, out of the prison-house.
        <Footnote number={106} />
        Indeed, He has promised to be with His people to the end of the world, and told us
        that God has sent the Comforter, the Spirit of Truth, to remind us of all that He
        said and to guide and direct us in the way of Truth.
        <Footnote number={107} />
        Is it right that we are mocked for attesting the sufficiency and utility of the
        teachings of this holy unction sent into our hearts,
        <Footnote number={108} />
        and in believing that, though Christ is in His glorified body in Heaven, yet He is
        also present in the hearts of His people?
        <Footnote number={109} />
        For He is King of Saints, and shall He not then rule in them?
      </MdxP>
      <MdxP>
        The high and holy One that inhabits eternity, has promised to dwell also with the
        humble and contrite,
        <Footnote number={110} />
        to revive and comfort them. And shall He not, whose presence fills heaven and
        earth, be present in the heart of man as well? Shall He that “rejoices in the
        habitable parts of the Earth, and delights in the sons of men,”
        <Footnote number={111} />
        not reside in His people? Are they not members of Him, and He their head? Can
        there be a more intimate union and communion than between the head and the body,
        the vine and the branches?
        <Footnote number={112} />
        The same Spirit of life that is in the head, is the life of the body also, and
        acts in it. He that is joined to the Lord is one Spirit;
        <Footnote number={113} />
        and does not the life that is in the root pass to the branches also, and preserve
        them alive? Are not all considered “dead branches” in whom this life is not?
        Whosoever has the Son of God and feeds on Him has life by Him;
        <Footnote number={114} />
        and those who do not have Christ, who is the life of His saints, have not life.
        How could His people in all ages be said to partake of Him if He were not present
        in them?
        <Footnote number={115} />
        Surely this doctrine does not deserve to be scoffed at, but is most comforting to
        those who are lovesick, and who thirst ardently after the enjoyment of Him, and
        not merely after the hearing of Him.
      </MdxP>
      <MdxH2 id="only-one-christ">Only One Christ</MdxH2>
      <MdxP>
        Consider seriously these things (which are agreeable to Scripture), and with what
        reason people have derided us for our belief herein, calling it “the Quakers’
        Christ,” as though His manifesting Himself in our hearts were{` `}
        <em>another,</em> or
        {` `}
        <em>distinct</em> Christ from that Jesus Christ of Nazareth who is glorified with
        God the Father in heaven. This we heartily deny; for though He has ascended into
        heaven, and sits at the right hand of God far above all principalities and powers;
        yet He is not so limited or restricted but that (as by Him all things were made
        and created
        <Footnote number={116} />
        ) He is also the life who fills all in all in His church and people. Is the
        divinity and humanity of Christ divided? Is not this inseparable union the true
        and entire Christ? Can His Godhead be present, and He who is the heavenly Man be
        absent? What do you think of Him that appeared to John, and gave him His
        commission to the seven churches?—whom John describes (Revelation 1:12-17), and
        who says, “Behold, I stand at the door and knock, if any man hears My voice, and
        opens the door, I will come in to him, and will sup with him, and he with Me.” The
        same says, “I am He who searches the minds and hearts, and I will give unto
        everyone of you according to your works.”
        <Footnote number={117} />
      </MdxP>
      <MdxP>
        Is not this the true Christ, the true Mediator, by whom God will judge the world?
        <Footnote number={118} />
        And can He make such a close inspection into the innermost part of the minds of
        men, so as no thought can escape His notice, if He be not present there? What made
        Paul desire that our Lord Jesus Christ might be with Timothy’s spirit, if he
        thought such a thing was impossible?
        <Footnote number={119} />
        Do not all Christians acknowledge the Spirit of Christ, who is the anointed One,
        to be <em>in</em> His people. How then can He be absent? Is the fact that it is a
        mystery, far beyond our ability to conceive, a sufficient argument that it is
        therefore not so? Ought we not in such cases to exercise faith, and acquiesce to
        the testimony of the Holy Spirit expressed in the sacred Scriptures, rather than
        interpose with our fine and curious speculations?—not prying unnecessarily into
        things that are too high for us, but remembering that the secret things belong to
        God, and that those who know most here, know only in part the things that are
        invisible, and see them but as in a mirror.
        <Footnote number={120} />
        Shall men who neither understand themselves, nor have any intuitive knowledge of
        their essences, or even the lowest things with which nature everywhere presents
        us, which are obvious to our senses; should these, I say, yet aspire to know
        things far more inscrutable, and undertake to explain that which is beyond the
        reach of the most gifted wits to penetrate.
      </MdxP>
      <MdxH2 id="set-free-from-sin">
        Christ Able to Set Free from the Power of Sin in this Life
      </MdxH2>
      <MdxP>
        We hope it is no error to affirm the power of Christ to be stronger than that of
        the devil, that He is able really to bind him, to bruise his head,
        <Footnote number={121} />
        and break his power, to dispossess and cast him out, to fulfill to the uttermost
        the purpose of His coming, to destroy the works of the devil, and to save those
        from their sins who have true faith in His name and power. Surely it is not
        inconsistent with Christianity to believe that Christ can, or will, thoroughly
        purge His threshing floor; that He can indeed deliver out of the prison-house and
        restore man out of the fall up to God again,
        <Footnote number={122} />
        and give him power to forsake the devil and all his works, etc.
      </MdxP>
      <MdxP>
        We find it consistent with Scripture, and with the gospel-dispensation, to believe
        that those who are regenerated and born again of the Spirit, have through the
        Spirit mortified the first carnal and corrupt nature
        <Footnote number={123} />
        which cannot please God; and if this is dead, and slain, and buried too, surely
        then it no longer lives, but the mind is at liberty, and restored to act in
        newness of life, to walk after the Spirit, and fulfill the righteousness of the
        law,
        <Footnote number={124} />
        the law of the Spirit of life in Christ Jesus having set them free from the law of
        sin,
        <Footnote number={125} />
        and from death which is its wages.{` `}
        <em>
          It is for lack of people’s experiencing this real birth of the Spirit brought
          forth in them,
        </em>
        {` `}and knowing freedom in themselves by it—which no duties or performances in
        the will of man, nor entertaining the most refined opinions in religion can
        administer, short of the law of the Spirit of Christ in their hearts—it is for
        lack of this, I say, that people are so very apprehensive of the difficulty, and
        quick to call it it an impossibility, for man to live a holy righteous life; which
        yet is so necessary to our salvation, that we are told that without holiness we
        can neither enter the kingdom of heaven, nor see God.
        <Footnote number={126} />
        Nor is the way broader, or its passage less narrow and difficult than they
        imagine; for it is absolutely impossible for man to walk therein while he is
        immersed in his first corrupt and unbridled nature, which cannot keep the law of
        God. For in this nature, the lusts and passions of man are rampant, their
        affections are inordinate, their wills unsubjected, and they follow the desires
        and evil inclinations of their minds without restraint.
      </MdxP>
      <MdxP>
        But if they come to experience another seed or power to govern their minds, to
        create in them new clean hearts, to regulate and subject their wills, to subdue
        and tame their passions, to limit their desires, and direct their affections and
        inclinations wholly after that which is good, to correct their spirits throughout,
        and make them heavenly-minded, giving them an aversion to all evil, and a great
        love to virtue and goodness; being thus perfectly transformed, where is the
        extreme difficulty now, “for the good man, out of the good treasure of his heart,
        to bring forth good things?”
        <Footnote number={127} />
        Will not this new well-inclined inside, that now detests evil, and loves and
        delights in righteousness, as naturally follow after and bring forth that which is
        good, as before it did evil? Here there is no force upon man’s nature, but he is
        converted, and thoroughly leavened into{` `}
        <em>another nature,</em> and in his measure made a partaker of the Divine nature,
        <Footnote number={128} />
        which alone can work the will of God.
      </MdxP>
      <MdxH2 id="watchfulness">The Necessity of Diligence and Watchfulness</MdxH2>
      <MdxP>
        We request our piously-inclined neighbors to seriously weigh and consider the
        absolute necessity there is for every true Christian thus to experience their
        minds molded and fashioned anew by the power and Spirit of Christ
        <Footnote number={129} />
        working mightily in them, in order to please God in a holy and righteous life,
        escaping the corruption that is in the world through lust. And knowing that though
        this is far more quickly apprehended as being necessary in the understanding than
        it is truly attained; we say that all, with great diligence, must faithfully give
        themselves to the performing of that which is the main and proper business of this
        life. Therefore, as it has pleased the Divine Power to give us all things
        pertaining to life and godliness,
        <Footnote number={130} />
        so let us with vigilant attention, cooperating with that grace which is given for
        that purpose (and not resisting it), work out our salvation with fear and
        trembling;
        <Footnote number={131} />
        since a good degree of attainment herein is soon lost unless there be a constant
        and diligent watchfulness upon the mind amidst all business and concerns, keeping
        a check upon our words and thoughts, and a faithful pressing forward. For while we
        live in this world we are liable to temptations, and it is easy to enter therein
        without a strict care and watchfulness,
        <Footnote number={132} />
        our senses presenting many baits to our minds on every hand, which Satan makes use
        of to deceive. And there are also many provocations that present themselves in our
        pilgrimage, against all of which God’s grace is sufficient armor
        <Footnote number={133} />
        as our minds are seasoned by it, so that where there is any failure or fault, it
        is through our own insincerity, negligence, or omission.
      </MdxP>
      <MdxH2 id="universal-love">
        God’s Universal Love; and Man’s Ability to Reject it.
      </MdxH2>
      <MdxP>
        Nor is it a “dangerous heresy” that we (with very many other professors of
        Christianity) believe in the universality of the love of God extended all mankind.
        For we read in Scripture that God is good to all, and that His mercies extend to
        all the works of His hands;
        <Footnote number={134} />
        and we believe that He is sincere in His declaration (and does not design to
        delude us) when He affirms that “as certainly as He lives, He desires not the
        death of a sinner, but rather that he would return and live.”
        <Footnote number={135} />
        We believe that God, whose love and mercy is unlimited, does graciously and
        generously <em>offer salvation,</em> through Jesus Christ, (upon certain
        conditions to be performed on our part) to all mankind, to every individual man
        and woman upon the face of the Earth,
        <Footnote number={136} />
        which is the true gospel-message, “good tidings of great joy, which shall be to
        {` `}
        <em>all people;</em> peace on Earth, and good will towards men;”
        <Footnote number={137} />
        This is indeed a good cause to rejoice, that all are within the reach of mercy and
        free pardon;
        <Footnote number={138} />
        that God is indeed no respecter of persons, but among all nations and people, he
        or she that fears Him, and works righteousness by Him, is accepted of Him.
        <Footnote number={139} />
        We believe Christ died for the sins of the whole world,
        <Footnote number={140} />
        yes, for every man; surely then, all for whom He died are thereby put into a
        capacity for salvation;
        <Footnote number={141} />
        for saving grace has appeared to all men,
        <Footnote number={142} />
        and a manifestation of the Spirit is given to every man to profit withal.
        <Footnote number={143} />
        And we believe that none are condemned or reprobated but those who continue
        willingly deaf to the calls of this grace,
        <Footnote number={144} />
        and resist the Spirit,
        <Footnote number={145} />
        and hide and neglect their talents till the day of their visitation is over.
        <Footnote number={146} />
        With these Christ finally withdraws Himself, and ceases to strive with them
        longer; so that the means now being taken away, they are left to themselves
        <Footnote number={147} />
        and given up to hardness of heart;
        <Footnote number={148} />
        no longer finding in themselves that which would prepare, tenderize, and soften
        it, so that they at last are unable to repent, believe, and be converted.
      </MdxP>
      <MdxH2 id="election">The Error of Personal Election and Reprobation</MdxH2>
      <MdxP>
        If to believe this is a “dangerous and pernicious error,” we confess we are
        guilty; for we cannot persuade ourselves to embrace that anti-evangelical opinion
        that God, from all eternity, has personally and unconditionally—without respect to
        their accepting or rejecting the salvation offered in Christ—elected some to be
        saved and others to be reprobated by an immutable decree; so that those who are so
        elected shall certainly be saved, let them do whatever they will, for God’s decree
        cannot be reversed. Nor can we believe the idea that those who are reprobated were
        in effect damned thousands of years before they were born, so that their salvation
        is put beyond all hope, regardless of how earnestly and diligently they seek, or
        how desirous they are to serve and please God. For this seems rather to be ‘sad
        tidings to most men,’ instead of ‘glad tidings to all men,’ if it were really true
        in itself. Moreover it puts an end to the whole business of religion, by rendering
        all worship and devotion, all preaching, praying, assembling together, and holy
        living, as it were, useless, by invalidating all whatsoever on man’s part, as
        being nothing that contributes (as a necessary condition on his part to be
        performed or neglected) towards either his salvation or eternal destruction.
      </MdxP>
      <MdxP>
        Indeed, we dare not take up an opinion so diametrically opposed to the very
        attributes of God, and His repeated declarations to the contrary, and thus presume
        to accuse His justice, mercy and goodness. We cannot believe such things of God,
        who is love itself, and goodness itself, and has always manifested a wonderful
        care and concern for man as His beloved creature; for it seems very disagreeable
        to His power to condemn those that have not deserved to be punished.
        <Footnote number={149} />
        And having plainly stated that He has no pleasure in the death of him that dies,
        <Footnote number={150} />
        it seems absurd to suggest that He nevertheless created the greatest part of
        mankind with a design to damn them, unprovoked thereto, without ever offering them
        salvation; or that He would make the far greater number of men wholly incapable of
        accepting the salvation offered to them, by putting it out of their power to
        perform those conditions and terms upon which He offers it, and then condemn them
        to eternal misery for not complying with that which it was impossible for them to
        observe. For He not only calls to all the ends of the earth (which implies all
        mankind) to look unto Him and be saved,
        <Footnote number={151} />
        but He has given to everyone a portion of His Spirit to enable them so to do. He
        has not only sent forth the Son of His love to taste death for every man,
        <Footnote number={152} />
        to be lifted up as Moses lifted up the brazen serpent, that whosoever believes in
        Him should not perish;
        <Footnote number={153} />
        but He also draws them,
        <Footnote number={154} />
        and as they are willing to receive it; He touches them with that Divine Magnet
        which alone can incline and empower them effectually to turn to the source of all
        true happiness.
      </MdxP>
      <MdxP>
        But <em>this</em> is the condemnation: that light has come into the world, and men
        love darkness rather than light, because their deeds are evil, and hate the light,
        and will not bring their deeds to it, lest it should reprove them.
        <Footnote number={155} />
        For whatsoever is reprovable is made manifest by the light,
        <Footnote number={156} />
        but men love their own broad ways, to pursue the sight of their eyes and the
        desire of their minds,
        <Footnote number={157} />
        and therefore hate to be controlled therein and reformed. The apostle, stirring up
        the Ephesians to purity of life, and to avoid several evils there mentioned,
        expressly says, “Let no man deceive you with vain words, for because of these
        things the wrath of God comes upon the children of disobedience.”
        <Footnote number={158} />
        And in another place, he says, “Those who live according to the flesh shall die.”
        <Footnote number={159} />
        It is therefore for lack of people��s embracing the means provided by God, and
        bringing their deeds to the Light of Christ in their hearts, and heeding the
        reproofs of instruction which are the way of life;
        <Footnote number={160} />
        it is for lack of sowing to the Spirit, and by the Spirit putting to death the
        deeds of the flesh,
        <Footnote number={161} />
        that people are lost and sentenced to perdition, and not because they were
        personally and unconditionally reprobated from all eternity. God, who is Lord of
        all, is gracious unto all, and desires all men to be saved;
        <Footnote number={162} />
        but many disobey the call of God, reject His offers, resist the strivings of His
        Spirit, turn a deaf ear to those knocks of our Savior for reception and lodging in
        their hearts,
        <Footnote number={163} />
        choose and prefer the present world, and will not deny themselves to follow
        Christ. It is not as some men say, that salvation was never within their reach. If
        so, were those feigned tears that our Savior shed over Jerusalem when the day of
        its visitation was over? Saying also, “How often would I have gathered you as a
        hen gathers her chickens, but you <em>would</em> not.” Notice He did not say, “you
        {` `}
        <em>could</em> not.”
        <Footnote number={164} />
      </MdxP>
      <MdxP>
        And if any men can be so bold as to entertain an opinion so derogatory to the
        justice, mercy, love, and paternal care of God, and so repugnant to the
        gospel-message, we cannot but wonder at what would induce them to thrust this
        doctrine upon others, and urge it as though it were a necessary point to be
        believed in the Christian religion. For we cannot apprehend how this begets any
        love to God, increases faith in Christ, raises our veneration for Him, excites
        unto diligence, or encourages piety, which is that which advances true religion.
        On the contrary, this doctrine tends to the indulging of some in a false security,
        and procures in others a slight esteem of the death and sacrifice of Christ as
        being partial. By it some are cast into despair, and others are encouraged to
        gratify the desires of their minds to the full extent, since nothing can alter
        such a supposed decree of God one way or the other.
      </MdxP>
      <MdxP>
        Yet we do not deny the foreknowledge of God, who knows all things, past, present
        and future, these all being present to Him at once; so that it may truly be said,
        that those who believe in Christ with that living and active faith that works by
        love, and excites unto obedience, and who persevere therein unto the end, and so
        know salvation by Him, are in the One in whom the election is before the world
        began. And likewise, those who do not believe, but rather reject the offers of His
        love, and by persisting in disobedience, neglect so great a salvation, can be said
        to be condemned already. Nor do we deny such a prerogative on God’s part as that
        some are made stewards over more, and some over fewer talents, according to which
        their increase ought to be proportional. Where much is given, much is required,
        <Footnote number={165} />
        and where less is given, less is required; for God is just and equal in all His
        ways; He is not a hard Master that He should exact or expect more than the
        increase of His own.
        <Footnote number={166} />
        Had he who received but one talent employed it, and made it two, we doubt not but
        this had been accepted by the Master; for we believe that none are from eternity
        absolutely excluded from receiving any talent, and that also a time is granted
        wherein it is possible for them to increase it. So that, though the grace may work
        more powerfully in some than in others, yet are all left without excuse.
      </MdxP>
      <MdxH2 id="once-in-grace">Once in Grace, Always in Grace?</MdxH2>
      <MdxP>
        There is yet another opinion which is dependent upon the above-mentioned doctrine,
        that we can neither receive (as they state it), for which our opposers think very
        ill of us; and that is, once a man is in a state of grace he must ever be so; or
        that there is no ability to fall away from grace. How this doctrine promotes true
        zeal and piety, and improves Christianity, we cannot understand, nor see any other
        reason why its supporters should be so fond of it, except because it is agreeable
        to the doctrine of personal election and reprobation; so that those who embrace
        the one, are bound to believe the other. But otherwise, it certainly tends rather
        to slacken than to spur on people to that care and diligence, and constant
        unwearied watchfulness unto prayer, which our Lord so much exhorted us to, and the
        apostles so solicitously pressed the saints everywhere to be found in, as being
        something of absolute necessity.
      </MdxP>
      <MdxP>
        What is the meaning of those promises of reward in the book of Revelation to those
        who would “overcome” and “hold out to the end,” except to encourage the church to
        a constant perseverance? Or what need was there for such words if it were
        impossible for them to fall away (who I suppose none will deny to have been in a
        state of grace)? The Church of Ephesus was threatened to have their candlestick
        removed if they did not repent and do their first works; and that of Laodicea was
        near to being spewed out of his mouth.
        <Footnote number={167} />
        And who can say those foolish virgins in the parable were not once in a state of
        grace, whose lamps were previously lit, trimmed and burning; for how else could
        they properly be said to have gone out to meet the Bridegroom?
        <Footnote number={168} />
        Or who can say that those were not called by saving grace in whose hearts the
        heavenly seed sprung up, and for a time prospered, until the briars and thorns,
        the cares and concerns about the things of this life, choked it.
        <Footnote number={169} />
        Clearly, it was not that they had no day of visitation from God wherein they might
        have worked out their salvation with fear and trembling, had they continued to
        make the kingdom of heaven and its righteousness their first and chiefest choice,
        placed their treasure there, and disentangled themselves from those unnecessary
        cares. No, the seed that was sown and began to spring up in these was{` `}
        <em>the very same seed</em> that in the honest heart brought forth fruit
        abundantly.
      </MdxP>
      <MdxP>
        Surely Paul, that great apostle, was not of these men’s opinion, when after he had
        long labored in the gospel, said, “I keep under my body and bring it into
        subjection; lest that by any means, when I have preached to others, I myself
        should be a castaway.”
        <Footnote number={170} />
        Who will not grant that the apostle, when writing these words, was then
        effectually in a state of grace? And the author to the Hebrews writing in the
        third chapter, to those he calls “holy brethren” and “partakers of the heavenly
        calling,” in verse 12, exhorts them, “Beware, brethren, lest there be in any of
        you an evil heart of unbelief in departing from the living God.” And again, in
        chapter 4:1, “Therefore, since a promise remains of entering His rest, let us fear
        lest any of you seem to have come short of it.” Verse 11: “Let us labor therefore
        to enter that rest, lest any man fall after the same example of unbelief.” Again,
        chapter 6 verses 4-6, speaking of those who had been enlightened, had tasted of
        the heavenly gift, were made partakers of the Holy Spirit, had tasted the good
        Word of God and the powers of the world to come, (showing signs that they were
        effectually called, and in a state of grace) that if they should fall away, it
        would be impossible to renew them again to repentance;{` `}
        <em>not because they were reprobated from eternity,</em> but because they
        “crucified to themselves the Son of God afresh,” because they grieved His good
        Spirit, and rejected the means.
      </MdxP>
      <MdxP>
        Our Savior says of Himself, “I am the true vine, you are the branches; My Father
        is the husbandman, every branch in Me that bears not fruit He takes away.” Again,
        “If a man abide not in Me, he is cast forth as a branch and is withered.”
        <Footnote number={171} />
        Surely, it must be said that while these remain branches in Christ they are
        accepted of the Father; and yet it seems clearly possible for them to fall away
        and be cut off as withered branches. Thus Christ often repeats this condition: “
        <em>if</em> you abide in Me;” and presently says that the way to continue in His
        love was to do His will, as He had done with respect to His Father’s, and
        continued in His love.
        <Footnote number={172} />
        But though we cannot embrace our opponent’s opinion, and must stand with the
        scripture declarations which amply demonstrate how a man may make a considerable
        progress in grace, and yet for lack of a careful and constant watchfulness to that
        grace may fall away; yet we also believe that there exists such a state and growth
        in grace through a vigilant attention thereto, and such a degree of faith
        attainable, as that there is no more going forth from it.
        <Footnote number={173} />
      </MdxP>
      <MdxH2 id="sacrements">The Sacraments (so-called)</MdxH2>
      <MdxP>
        But that which seems to be our “capital error,” and the highest of all their
        charges, and that which must silence all other pleas on our behalf, is our
        omitting the use of the sacraments (so called) of baptism, and the bread and wine.
      </MdxP>
      <MdxH3 id="baptism">Baptism</MdxH3>
      <MdxP>
        John indeed, as the immediate forerunner of Christ to prepare His way, gave an
        alarm to the Jews who felt themselves secure under the law of Moses, proclaiming
        to them that the kingdom of heaven was at hand, and that the time had come wherein
        God commanded both Jews, as well as others everywhere to repent.
        <Footnote number={174} />
        It was not sufficient for them to go on in sinning, and then to offer the
        respective sacrifices which the law required for the same; for now the wrath of
        God was near to be revealed from heaven against all ungodliness and
        unrighteousness of men.
        <Footnote number={175} />
        It was not sufficient to adorn or clean the outside of the cup and platter, but
        the inside was to be cleansed, and then the outside would be clean also. The axe
        was now laid to the root, and every tree that did not bring forth good fruit was
        to be hewn down.
        <Footnote number={176} />
      </MdxP>
      <MdxP>
        The law of Moses took hold on exterior acts and could not make men perfect as
        pertaining to the conscience;
        <Footnote number={177} />
        but now a dispensation was about to be established that came nearer to home,
        taking cognizance of the very thoughts, wherein sin would be not so much as
        allowed to be conceived by the will’s joining thereto.
        <Footnote number={178} />
        Therefore John was sent to administer the baptism of repentance as a living figure
        of that which was to follow presently after; for John’s baptism was not capable of
        producing this effect upon the heart. And he himself testified, that though he
        baptized them with water, yet One that came after him (who was before him, and
        more honorable than he) should baptize them with the Holy Spirit and with fire;
        that His fan was in His hand, and He should thoroughly purge His floor.
        <Footnote number={179} />
        This is the great work that is to be done under Christ’s gospel-dispensation—to
        take away the sins of the world, and destroy the works of the devil;
        <Footnote number={180} />
        to purify people’s hearts, and make them spiritually minded; this is the proper
        effect of Christ’s lasting baptism. As Peter says, it is “not the washing away of
        the filth of the flesh, but the answer of a good conscience towards God,”
        <Footnote number={181} />
        to purge our consciences from dead works, to serve the living God in newness of
        life.
      </MdxP>
      <MdxP>
        The baptism of Christ is but one, and those who by it are baptized into Jesus
        Christ, are baptized into His death, their old man being crucified with Him, that
        the body of sin may be destroyed and they no longer serve sin, because they that
        are dead with Christ are freed from sin, and made alive to God,
        <Footnote number={182} />
        to live a holy and righteous life. These are the blessed effects of the baptism of
        the Holy Spirit and fire, and the benefits that redound to those who are truly
        washed by Christ in that holy laver which entitles us to a part in Him.
        <Footnote number={183} />
        Now we believe that{` `}
        <em>
          it is our chiefest concern to experience this inward spiritual baptism of
          Christ,
        </em>
        {` `}that our hearts may be washed, purified, and sanctified by the Spirit of God;
        <Footnote number={184} />
        and that we really put on Christ, and are in Him, who is the substance, in whom
        the types and shadows have ended. John knew and foretold that “he must decrease,
        but Christ must increase;”
        <Footnote number={185} />
        Note, he does not say, “I shall cease immediately, just as soon as Christ’s
        baptism takes place;” but rather “I must decrease.” But if water-baptism were
        intended to continue always among Christians, then John would not at all decrease.
        Nor does the following allegation solve the problem: that water-baptism was
        abolished as belonging to John, but was then re-instituted as belonging to Christ;
        for then Christ would have two gospel-baptisms, which is erroneous.
      </MdxP>
      <MdxP>
        We grant that some of the apostles did use water-baptism for a time, but we
        believe it was rather in compliance with the circumstances of the time than out of
        necessity, and in condescension to the weakness of believers in the very infancy
        of the church, being even the same age wherein John had baptized, who was not only
        a true messenger of God in his time, but had gained great credit among the people,
        and his memory and message could not soon be forgotten. Nor was it easy to draw
        the people away from a practice that had just before been acknowledged to be of
        divine authority. And we also find that the apostles tolerated the believing Jews
        to live in certain rites and ceremonies of the Mosaic law for a time,
        <Footnote number={186} />
        notwithstanding the Messiah had already come in the flesh and abrogated them; so
        difficult it was to disengage people from those things wherein they have been
        raised and educated, and to which their minds were strongly glued. Indeed, some of
        these followers of Christ would have had the believing Gentiles come under the
        same yoke of circumcision, which Paul their great apostle withstood, seeing beyond
        all those things and knowing that the kingdom of God was not food and drink, but
        righteousness, peace, and joy in the Holy Spirit.
        <Footnote number={187} />
        Indeed, Paul taught openly that the kingdom was not in word but in power,
        <Footnote number={188} />
        not in various washings and carnal ordinances which were shadows and to perish,
        but the substance was of Christ, and those that are in Him, are in Him complete,
        saying that if they afterwards returned to the covenant of circumcision, Christ
        would profit them nothing.
        <Footnote number={189} />
        And yet we find that, such was his condescension towards these young believers,
        that he nevertheless circumcised Timothy, and that when he was at Jerusalem he
        shaved his head, etc.
        <Footnote number={190} />
        behaving himself as a Jew, for the sakes of those who saw not as far as himself.
        <Footnote number={191} />
      </MdxP>
      <MdxP>
        And notwithstanding he was such a laborious and zealous preacher of the gospel,
        yet we find he baptized but very few with water, and even thanked God that he had
        baptized no more,
        <Footnote number={192} />
        (clearly manifesting that water baptism was not then essential to the gospel) and
        rather said plainly, that he was not sent to baptize, but to preach the gospel,
        <Footnote number={193} />
        to turn people from darkness to light, from the power of Satan to God, who had
        delivered them from the power of darkness, and translated them into the kingdom of
        his dear Son;
        <Footnote number={194} />
        it is <em>this</em> that is of absolute necessity to our salvation. Paul did not
        then baptize simply because some others did it (which yet is as real a commission
        as perhaps any can pretend to have now-a-days.) And it is for this reason that we
        sometimes say of baptism what Paul said of circumcision: “For in Christ Jesus
        neither baptism nor no-baptism avails anything, but a new creation.” For being
        made a new creature is the truest sign of possessing the inward spiritual grace,
        and of being in Christ, and is beyond all outward signs whatsoever.
      </MdxP>
      <MdxP>
        The apostles having thus indulged this practice for a time, it is no wonder that
        water baptism was continued in the ages to follow, and shortly thereafter got
        footing in the degeneracy that sprung up. For as corruption entered the church and
        increased, the Spirit and life of Christianity was more and more eclipsed, and the
        minds of its professors grew darker, and then adhered more and more to external
        performances. And these not only continued those things that had been used by
        their predecessors, or at least something similar in its stead, but by degrees
        added more rites and ceremonies, and at length began to trim and adorn that
        religion that was at first plain, simple, and homely, and{` `}
        <em>consisted more in power and divine love than in outward observations.</em>
        {` `}And this, in the process of time, was so dressed and garnished, that its
        distinguished splendor became inviting to others. Under a degree of this
        degeneracy sprung up the practice of infant-baptism, a mere human invention,
        without any scripture-authority either by precept or practice; though the
        practitioners of it often reproach us for the neglect of it.
      </MdxP>
      <MdxH3 id="bread-and-wine">Bread and Wine</MdxH3>
      <MdxP>
        But that which makes the loudest outcry of all is our disuse of the sacrament (so
        called) of bread and wine. This is that “pestilent mortal error” that, in our
        opposer’s opinion, renders us worse then the papists. But whether such words have
        been justly bestowed upon us, we desire our sober neighbors to consider—not
        judging by hear-say, or by an implicit belief in what others say about us.
      </MdxP>
      <MdxP>
        We are not ignorant of the great noise and stir that has been made about this
        subject in Christendom, to the scandalizing of Christianity among both Jews and
        Turks. The papists have turned it into downright idolatry, affirming it is the
        real body and blood of the Son of God, and as such they adore it. Others say that
        Christ is in it, though they know not how; one says it is this, another it is
        that; while they all seem to expect something from it which it does not
        necessarily administer; and all for lack of distinguishing between the real bread
        of life that came down from heaven (that flesh and blood of Christ which gives
        life to all that feed thereon, by which they dwell in Him and He in them,
        <Footnote number={195} />
        ) and that supper which was eaten by the primitive Christians in commemoration of
        His death and sacrifice, which are not so connected as that the one necessarily
        includes the other, as experience abundantly testifies, if people would but be
        honest with themselves herein. How many are there that receive the outward bread
        from year to year, who yet complain all their lives of deadness, dryness, and
        leanness of soul, and of lack of power, not receiving that renewing of life and
        spiritual strength that is proposed to be in it? For how can they in truth expect
        to feed on Christ spiritually in their hearts who will not admit that He really
        dwells in His saints,
        <Footnote number={196} />
        but esteem it an error in those that do.
      </MdxP>
      <MdxP>
        We, however, believe that all people ought to be well-persuaded in their own
        minds, and seriously considerate of these and other religious practices, not
        taking up things merely upon tradition because others do them; nor ought they to
        be vehemently pressed to or against things that are not absolutely essential to
        salvation, in which their understandings are not yet clear. Nor should any be
        scoffed at or reproached for those things which to them are a matter of
        conscience, and therefore sacred, though to others they may appear of less
        importance; indeed, this is a practice that is a great shame among people
        professing Christianity. Nor do we judge or condemn those that are found in the
        practice either of this or water-baptism as it was primitively used, whose sober,
        Christian, circumspect lives witnesses to their sincere intentions herein, who may
        be conscientiously tender in it, and fearful to omit it, till they are otherwise
        fully persuaded. But as for us, to whom the barrenness and emptiness of these
        outward visible signs are manifest, we cannot continue therein, finding that the
        outward practice of them yields no true soul-satisfaction, nor administers any
        inward spiritual grace to us.
      </MdxP>
      <MdxP>
        Therefore having tasted that the Lord is good and gracious, we wait for the pure
        milk of that Word by which we have been begotten to God,
        <Footnote number={197} />
        that we may receive strength thereby, and grow in grace, and in the knowledge of
        our Lord Jesus Christ,
        <Footnote number={198} />
        and come to a greater acquaintance with that true inward spiritual communion and
        fellowship with Him, wherein He sups with His saints, and they with Him;
        <Footnote number={199} />
        and receive life by Him who dwells in them, and they in Him—just as the members of
        a body are joined to the head, and partake of its life, and live by it;
        <Footnote number={200} />
        or the branches are joined to the Vine,
        <Footnote number={201} />
        which receive life, virtue and nourishment from it, whereby fruit is brought forth
        to the glory of God, and is well-pleasing to Him. It is not sufficient that we
        participate of this eating and drinking once a month, or once a quarter, but
        rather as the Jews had their manna,{` `}
        <em>fresh every morning.</em>
        <Footnote number={202} />
        So we ought to receive a daily supply, and a renewing of strength in our inward
        man by eating that heavenly bread that nourishes up to eternal life, drinking
        plentifully of that well of living water, which in the saints springs up to life
        eternal.
        <Footnote number={203} />
        For as in God we live, move, and have our very being;
        <Footnote number={204} />
        so Christ is the true and proper life for the inward man by which it truly lives
        to God, nor can it live except by Him. Those who are begotten to God by the Word
        of life, and are born again of the Spirit, are privileged thus to feed on Christ
        and enjoy Him, which none can do that are not first quickened and made alive by
        Him. Indeed, none can receive life, sap and virtue from Him as their head and vine
        who are not first joined to Him as members and branches; nor is it sufficient to
        make people living members of Christ, and give them admittance to feed upon Him,
        simply because they were sprinkled with water when infants, as we have already
        expressed, though they should eat the church’s bread and wine all the days of
        their lives.
      </MdxP>
      <MdxP>
        And since then we enjoy the substance of this food and drink without the sign, why
        may we not omit the outward, shadowy part, as either being either temporary, or
        not of absolute necessity? And why may not the same authority absolve us from the
        use of this, and excuse us from being chargeable with the breach of a command of
        Christ, as that which releases other Christians from washing one another’s feet?
        <Footnote number={205} />
        Or what about the apostles’ injunction to avoid food that had been strangled and
        blood,
        <Footnote number={206} />
        or the custom mentioned by James of anointing the sick with oil?
        <Footnote number={207} />
        Why should our adversaries be partial concerning what Christians have laid aside?
        And have we not good reason to conclude that if these other things had not been
        long ago laid down, Christians today would have cleaved as close to them as they
        have done to water baptism? And on the other hand, if bread and wine had been
        discontinued then (when anointing with oil and concern over strangled food was
        laid down), would not most Christians feel easier in omitting it today? For
        tradition, custom, and education, makes greater impressions on men’s minds than we
        are perhaps sensible of; nor is it an easy task at first to move men away from
        those things to which they have thus been securely fastened.
      </MdxP>
      <MdxP>
        Since then God has replenished our hearts with His grace, and has not withheld His
        heavenly manna from us, but daily acknowledges us by His comfortable presence to
        our great satisfaction under the omission of these things, supplying our needs and
        necessities as we have recourse unto Him, who enables and strengthens those of us
        that retain our primitive sincerity and integrity to lead a sober, pious,
        Christian life, as adorns the gospel of Christ, which is the certain product of
        spiritual grace; and forasmuch as even our opposers acknowledge these sacraments
        to be but outward visible signs, and dare not say that the inward spiritual grace
        is necessarily tied to them, nor that they are of absolute necessity to salvation;
        with what reason then, we ask, do they declare us to be “no christians,” and also
        load us with calumnies and accusations on this account, often using it as an
        instance to blacken us and condemn our whole Christian profession?
      </MdxP>
      <MdxH2 id="notions">
        Not Notions in the Head, but a Spirit that Governs the Heart
      </MdxH2>
      <MdxP>
        For though adherence to certain forms and ceremonies may bind together and
        distinguish particular societies and communions, it is certain that no
        observations or performances short of being ruled and governed by the Spirit of
        Christ as head, can entitle us to a membership in Him. Indeed we may make an
        impressive outward appearance, and carry a system of divinity in our heads, but if
        Christ rules not in our hearts we are none of His. Now if the professors of
        Christianity were less taken up with signs and shadows, and nice and unnecessary
        scrutinies and distinctions, and more devoted to observe the weighty, important,
        and indispensable precepts of Christ, demonstrating the power that Christ has over
        their minds by showing themselves His true disciples, and rightful heirs of His
        kingdom, being in measure invested with His divine virtues and graces, we should
        surely have less envy, variance, back-biting, and detraction, (which weakens the
        common interest of piety, and gives our common enemy an advantage over us), and we
        would have more Christian love, peace, concord and good relations among us. Yes,
        if all that meant well did but pursue virtue, love it, and encourage it wherever
        it appears, and hate vice and evil in all, and disapprove of it everywhere, and
        make this the measure of their Christian charity (rather than various opinions on
        lesser matters), it would bring us nearer together, and more advanced in true
        piety, than all the contending about different apprehensions in things far less
        essential.
      </MdxP>
      <MdxP>
        God, who regards not names, but natures, knows among all nations and people who
        are His; and the rule He left us to know them was by their fruits, their actions
        being the exertion of their wills. All mankind are either under the power and
        guidance of the Spirit of God, or else of the devil; all are either carnal or
        spiritually minded, and whatever is the spring and bent of their desires and
        affections, so are their actions—each birth having its proper products, which are
        contrary to each other. So then, regardless what notions or opinions possess men’s
        heads, they nevertheless live according to the spirit and nature that governs
        their hearts. We cannot gather grapes from thorns, nor figs from thistles; no
        fountain sends forth bitter water and sweet at the same time. It is an evangelical
        truth, that those who live in envy and strife, and bring forth the fruits of the
        flesh,
        <Footnote number={208} />
        are of their father the devil; and those who, by the Spirit, put to death those
        corrupt lusts and affections, and bring forth the fruits of the Spirit,
        <Footnote number={209} />
        adorning the doctrine of God our Savior by a sober, godly, righteous life, these
        are of God—for herein the children of God are manifest from the children of the
        devil.
        <Footnote number={210} />
      </MdxP>
      <MdxP>
        Thus have we candidly, though briefly, expressed our real opinion and belief
        concerning those points in which we apprehend our adversaries have endeavored
        mostly to condemn us, which we hope may prove satisfactory to those who have not
        already resolved to think evil of us. Truly, we have no other interest to promote,
        but the advancement of true piety and Christianity; having love and good-will
        towards all people, and more especially to those whose minds are awakened and
        hearts warmed, having true fervent desires and living breathings towards God,
        thirsting after a nearer and more satisfactory knowledge of, and acquaintance with
        Him, than a bare outward profession or hear-say knowledge of Him. Therefore, what
        we have found to be advantageous, of assistance and satisfactory to us in our
        unwearied pursuit after peace with Him,{` `}
        <em>that</em> we recommend to others.{` `}
        <em>We call people home to the gift of God in themselves,</em> which alone can do
        them good, that everyone may know the good Shepherd and Bishop of souls for
        themselves, and hear and know His voice in them from that of a stranger, and so
        learn of Him and follow Him, who is pure and ever leads to purity and holiness, so
        that His offering up of Himself for them may be of benefit to them, and they
        experience the great salvation of God.
      </MdxP>
      <MdxH2 id="purpose-of-his-coming">The Purpose of His Coming</MdxH2>
      <MdxP>
        Impress this upon your minds and take it along with you: that notwithstanding our
        Savior has indeed paid a ransom for us, and made an atonement through the precious
        blood of His cross; yet if we do not experience the purpose of His coming, and
        that death effected and answered in ourselves, it shall avail us nothing. Unless
        we know Him to be both a Savior and Supporter near; unless we know a seed of
        Divine Light and life to illuminate our minds, to revive and warm our languishing
        hearts, to beget and increase true love to God, and that living faith that gives
        victory, governs our thoughts, renews and regulates our wills, limits our desires,
        bridles our tongues, excites holy inclinations, and keeps up a due ardency in our
        Christianity, strengthening our minds in that which is good and well-pleasing to
        God: I say, unless we know these things in and for ourselves, all our outward show
        of religion is but vain, and our profession of Christ shall profit us nothing, but
        we shall lie down in sorrow at last. For none are Christ’s, but those that have
        His Spirit, and are influenced by it. Nor are any children of God, but those that
        are led by the Spirit of God;
        <Footnote number={211} />
        which begets in the mind a detestation of all sin and evil, and a love to purity,
        goodness and virtue.
      </MdxP>
      <MdxH2 id="judgment-to-come">Judgment to Come</MdxH2>
      <MdxP>
        Therefore, laying aside all strife and animosities, all envying and evil-speaking,
        let us abhor that which is evil, and cleave to that which is good,
        <Footnote number={212} />
        and address ourselves with a due and humble application to the accomplishment of
        that most important affair of our lives, the “working out of our salvation with
        fear and trembling.” And let everyone follow the Lord faithfully, according to
        what is made known to them, knowing that we shall be judged according to our
        knowledge, and that it will be happy for those whose wills and performances
        correspond with their understandings in that day when all must stand before the
        judgment seat of Christ and give an account of their deeds done in the body, and
        so receive a sentence of either, “Come you blessed,” or, “Depart from me you
        workers of iniquity.”
      </MdxP>
      <MdxP>
        It then will be of no importance to what congregation or confession of faith you
        belonged, or of what persuasion among the many were you; for among all of these
        there will still be but two sorts: the sheep and the goats; that is, those who
        heard the Shepherd’s voice and followed Him, who were guided and governed by the
        good Spirit of God in their hearts; and those who, wrapping their talent in a
        napkin, stifled convictions, and neglecting the day of their visitation, continued
        under the dark power of the evil one. A man may go a great way, and make a fair
        show of religion and piety, and yet be turned away to the left hand in the end. It
        is not a matter of having our heads filled with curious or sublime notions, with
        fine and elevated speculations. Indeed, let us trim and garnish our lamps ever so
        finely, yet this will not administer an entrance without the heavenly oil, that
        is, without that holy divine unction which fills our hearts, enlightens our minds,
        and inflames our affections to a due watchfulness and obedience to its teachings,
        which are the most assured marks of our being really in Christ, in whom alone is
        our acceptance.
      </MdxP>
      <MdxP>
        It is our hearty desire that you with us, and we with you, may so circumspectly
        live up to that light and knowledge given to us by Christ, that our consciences
        may not condemn us; and so that, having finished our days here with comfort, we
        may lay down our heads in peace, with a well-grounded hope of a joyful
        resurrection, having boldness in the day of judgment.
      </MdxP>

      <MdxH3>Footnotes:</MdxH3>
      <Footnotes />
    </div>
  </div>
);

export default Page;

export async function generateMetadata(): Promise<Metadata> {
  if (LANG === `es`) {
    notFound();
  } else {
    return seo.nextMetadata(`Early Quaker Beliefs`, seo.QUAKER_BELIEFS_SEO_META_DESC);
  }
}

const Footnote: React.FC<{ number: number }> = ({ number }) => (
  <sup className="pr-1 relative inline-block">
    <span
      id={`src-${number}`}
      className="absolute"
      style={{ height: `${FIXED_TOPNAV_HEIGHT}px`, bottom: `1em` }}
    />
    <a
      className="text-flprimary font-bold"
      href={`#note-${number}`}
      title="View footnote."
    >
      {number}
    </a>
  </sup>
);

export const dynamic = `force-static`;
