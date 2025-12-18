import React from 'react';
import { notFound } from 'next/navigation';
import type { NextPage, Metadata } from 'next';
import { FootnoteRef } from '../what-early-quakers-believed/Notes';
import Footnotes from './Notes';
import { MdxH2, MdxH3, MdxLead, MdxP } from '@/components/mdx';
import WhiteOverlay from '@/components/core/WhiteOverlay';
import BooksBgBlock from '@/components/core/BooksBgBlock';
import * as seo from '@/lib/seo';
import { LANG } from '@/lib/env';

const Page: NextPage = async () => (
  <div>
    <BooksBgBlock>
      <WhiteOverlay>
        <h1 className="heading-text text-2xl sm:text-4xl bracketed text-flprimary">
          Creencias de los Primeros Cuáqueros
        </h1>
      </WhiteOverlay>
    </BooksBgBlock>
    <div className="MDX p-10 md:px-16 lg:px-24 body-text max-w-6xl mx-auto mt-4">
      <MdxLead>
        Durante casi 200 años, la primitiva Sociedad de Amigos (cuáqueros) sostuvo
        exactamente las mismas doctrinas, principios y prácticas que sus dignos fundadores
        (quienes a menudo declaraban que su cristianismo no era más que un retorno a los
        principios y prácticas de la iglesia primitiva). No fue sino hasta mediados del
        siglo XIX, cuando la gran mayoría de los cuáqueros se había convertido en hijos de
        la tradición, en lugar de verdaderos “hijos de la luz,” que una combinación de
        formalidad muerta y ambición humana (surgida bajo una falsa bandera de “reforma”)
        comenzó a desgarrar la sociedad que antes estaba unida, llevándola a un estado de
        gran desunión y descontento. Ya no unidos por la cuidadosa sumisión de cada
        miembro al Espíritu de la Verdad, el resultado (comparable al de la Torre de
        Babel), fue un doloroso desorden de confusión, división y enemistad, dejando muy
        pocos corazones humildes sobre el fundamento original.
      </MdxLead>
      <MdxLead>
        El breve folleto que se presenta a continuación (también disponible en{` `}
        <a className="subtle-link" href="/compilaciones/defensa-de-la-verdad">
          versión impresa, libro electrónico y audio
        </a>
        ) fue publicado en 1702 por William Chandler, Alexander Pyot, Joseph Hodges y
        otros Amigos, quienes habían sido calumniados y malinterpretados por otras
        congregaciones de su zona. Muchas obras doctrinales han sido publicadas por los
        Amigos para explicar y defender sus posturas sobre diversos puntos (véanse en
        particular{` `}
        <a className="subtle-link" href="/robert-barclay/esta-grande-salvacion">
          Esta Grande Salvación
        </a>
        {` `}de Robert Barclay,{` `}
        <a
          className="subtle-link"
          href="/joseph-phipps/estado-original-y-presente-del-hombre"
        >
          El Estado Original y Presente del Hombre
        </a>
        {` `}de Joseph Phipps, y{` `}
        <a className="subtle-link" href="/isaac-penington/escritos-volumen-1">
          Los Escritos de Isaac Penington
        </a>
        ). Pero quizás ninguna publicación de la Sociedad de Amigos haya descrito de forma
        tan clara y sucinta sus creencias sobre una variedad tan amplia de temas, ni las
        haya defendido con tanta claridad y franqueza, utilizando una multitud de citas
        bíblicas.
      </MdxLead>
      <MdxH2 id="introduction">Introducción</MdxH2>
      <MdxP>
        No es que amemos la contienda, ni deseemos la controversia, ni seamos impacientes
        al soportar reproches, lo que nos lleva ahora a publicar este breve tratado; sino
        que las repetidas acusaciones graves y los severos ataques que nuestros
        adversarios han lanzado sobre nosotros nos han llevado a sentir la necesidad de
        aclarar y defender la verdad y la inocencia de nuestra profesión cristiana. Por
        ello, deseamos que nuestros prójimos, los que tienen una buena disposición,
        consideren con honestidad lo que tenemos para alegar, y reciban una explicación de
        nuestra parte acerca de lo que somos y de lo que creemos y sostenemos como
        verdades cristianas; porque, sin duda, conocemos nuestras propias creencias mejor
        que aquellos que quizás nunca las han examinado con otro propósito que el de
        buscarles errores.
      </MdxP>
      <MdxH2 id="escrituras">Respecto a las Sagradas Escrituras</MdxH2>
      <MdxP>
        Esperamos que no les parezca extraño que no expresemos nuestra creencia en algunos
        puntos particulares con los términos escolásticos que usan otros profesantes
        cristianos, sino que consideramos mucho más razonable y seguro quedarnos con el
        lenguaje que el Espíritu Santo pensó conveniente entregarnos en las Sagradas
        Escrituras—esos escritos tan excelentes y sagrados que, por encima de todos en el
        mundo, merecen nuestra reverencia y una lectura muy diligente; esos oráculos de
        Dios y rico tesoro cristiano de verdades, que fueron escritos para nuestra
        enseñanza, “a fin de que por la paciencia y la consolación de las Escrituras,
        tengamos esperanza.”
        <FootnoteRef number={1} />
      </MdxP>
      <MdxP>
        Creemos que las Escrituras son útiles para enseñar, para redargüir, para corregir
        y para instruir en justicia, a fin de perfeccionar al hombre de Dios y prepararlo
        enteramente para toda buena obra, haciéndolo sabio para la salvación por la fe que
        es en Cristo Jesús;
        <FootnoteRef number={2} />
        las cuales contienen todas las doctrinas cristianas que se necesitan creer para la
        salvación, y son un estándar y piedra de toque externo que es suficiente para
        examinar las doctrinas de los hombres. Y decimos con el apóstol, que cualquiera
        que publique o propague un evangelio y fe diferente al que nos ha sido testificado
        en las Escrituras por esos escritores inspirados que fueron los primeros que lo
        promulgaron, aunque fuera un ángel, sea anatema.
        <FootnoteRef number={3} />
        Todo cuanto en ellas se contiene, lo creemos tan firmemente como cualquiera de
        ustedes; y, como es deber de todo cristiano sincero, estamos de todo corazón
        agradecidos a Dios por ellas, quien por Su bondadosa Providencia las ha preservado
        hasta nuestro tiempo, para nuestro gran beneficio y consuelo.
      </MdxP>
      <MdxH2 id="padre-hijo-espiritu">Respecto a Dios — Padre, Hijo y Espíritu</MdxH2>
      <MdxP>
        Creemos en el gran Dios omnipotente que hizo y creó todas las cosas y nos dio
        nuestro ser, a quien en sinceridad de corazón tememos, reverenciamos y adoramos,
        estando seriamente interesados en el bienestar eterno de nuestras almas. Creemos
        en ese gran misterio de que hay tres que dan testimonio en el Cielo—el Padre, el
        Hijo y el Espíritu Santo—y que estos tres son uno en ser y sustancia.
        <FootnoteRef number={4} />
        Y así como ustedes, también nosotros tenemos la esperanza y expectativa de obtener
        salvación solo y únicamente a través del Hijo de Dios, nuestro bendito Señor y
        Salvador Jesucristo de Nazaret; creyendo que Dios el Padre lo ha puesto para
        salvación hasta lo postrero de la tierra, y que no hay ningún otro Nombre dado
        bajo el cielo en que los hombres puedan ser salvos.
        <FootnoteRef number={5} />
      </MdxP>
      <MdxP>
        Creemos también que fue concebido por el Espíritu Santo, en el vientre de la
        virgen María, nació de ella en Belén, y vivió una vida santa y ejemplar,
        perfectamente libre de pecado.
        <FootnoteRef number={6} />
        Creemos en Sus doctrinas, milagros, sufrimientos y en Su muerte en la cruz, fuera
        de las puertas de Jerusalén; en Su resurrección de la muerte y en Su ascensión al
        cielo, donde está sentado a la diestra de Dios el Padre, siendo Dios perfecto y
        hombre perfecto, el único mediador entre Dios y los hombres, y nuestro abogado
        ante el Padre, quien vive siempre para interceder por nosotros;
        <FootnoteRef number={7} />
        y quien también juzgará tanto a los vivos como a los muertos.
        <FootnoteRef number={8} />
        Todo esto, y todo lo que en las sagradas Escrituras se registra acerca de Él, lo
        creemos firmemente.
      </MdxP>
      <MdxP>
        Creemos que este Jesús, en quien mora la plenitud de la Deidad,
        <FootnoteRef number={9} />
        se ofreció a Sí mismo conforme a la voluntad del Padre, como un sacrificio
        agradable a Dios, y se volvió una propiciación por los pecados de la humanidad,
        hasta lo último de la tierra.
        <FootnoteRef number={10} />
        Creemos que murió por todos los hombres, así como todos murieron en Adán;
        <FootnoteRef number={11} />
        mediante cuya sangre Dios proclama la redención y la salvación al hombre, y ofrece
        la reconciliación, y libremente, por amor a Su Hijo, está dispuesto a remitir,
        <FootnoteRef number={12} />
        perdonar y pasar por alto todos los pecados pasados a aquellos que verdaderamente
        y de corazón se arrepientan de sus pecados,
        <FootnoteRef number={13} />
        se aparten de ellos, crean en nuestro Señor Jesucristo y Lo amen por el resto de
        sus días, viviendo una vida cristiana santa y circunspecta, obedeciendo Sus
        mandamientos y permaneciendo así en Su amor.
        <FootnoteRef number={14} />
      </MdxP>
      <MdxH2 id="perfeccion">Apartarse de Iniquidad y la Doctrina de la Perfección</MdxH2>
      <MdxP>
        Esta vida santa fue tan celebrada y rigurosamente observada en las edades
        primitivas del cristianismo, que “cualquiera que invocaba el nombre,” o tomaba el
        nombre de Cristo, entendía que debía “apartarse de la iniquidad,”
        <FootnoteRef number={15} /> y creemos que esto debe estar presente en cada
        cristiano verdadero y fiel, como aquello que siempre acompaña a la fe verdadera y
        viva. Y aunque nuestros opositores se burlen de nosotros, y nos tilden de error
        por sostener la posibilidad de alcanzar perfección—porque abogamos por una vida
        santa y justa como aquello que agrada a Dios, y afirmamos que Su poder es más
        fuerte en el hombre (a medida que el hombre se aferre a él) que el del diablo para
        retenerlo en esclavitud,
        <FootnoteRef number={16} />
        y también porque a veces hemos usado las palabras de Cristo y de Sus apóstoles,
        como, “Sed, pues, vosotros perfectos, como vuestro Padre que está en los cielos es
        perfecto,”
        <FootnoteRef number={17} />
        y “todo aquel que tiene esta esperanza en él, se purifica a sí mismo, así como él
        es puro,”
        <FootnoteRef number={18} />
        —sin embargo, nunca hemos pretendido una perfección moral superior a la que se
        describe en las promesas de la Escritura antes mencionadas, las cuales son sanas y
        verdaderas en sí mismas, y declaran claramente lo que Dios desea y requiere de
        nosotros. Y es por esta razón que frecuentemente insistimos en la necesidad de la
        santidad y exhortamos fervientemente a las personas a ella.
      </MdxP>
      <MdxH2 id="gracia-y-obras">
        Salvación por Gracia, pero las Obras siempre van de la mano
      </MdxH2>
      <MdxP>
        Y a pesar de que por esto hemos sido acusados falsamente de esperar ser salvos por
        {` `}
        <em>nuestras propias</em> obras como si fueran meritorias, sin embargo no
        consideramos una vida santa como la causa eficiente y procuradora de nuestra
        salvación; la cual atribuimos completamente a la gracia y misericordia gratuita de
        Dios en Cristo sin ningún mérito en el hombre;
        <FootnoteRef number={19} />
        aunque consideramos que las buenas obras siempre van de la mano con ella, y son
        una condición necesaria de nuestra parte para cumplir con la oferta bondadosa de
        Dios,
        <FootnoteRef number={20} />
        sin la cual no podemos obtener la salvación, ya que están inseparablemente
        vinculadas a esa fe que solo agrada a Dios, y que es nuestro culto racional.
        <FootnoteRef number={21} />
      </MdxP>
      <MdxH2 id="creencia-historica">
        No es Suficiente una Creencia Histórica o Tradicional
      </MdxH2>
      <MdxP>
        Y creemos que, aunque Cristo se ofreció a Sí mismo una vez para siempre por los
        pecados de todos los hombres hasta lo último de la tierra,
        <FootnoteRef number={22} />
        haciendo posible el arrepentimiento y enmienda de vida; sin embargo, una creencia
        meramente tradicional o histórica en eso por sí sola no es suficiente para darnos
        derecho a esa salvación común que viene por Él, sino que es necesario que
        realmente nos arrepintamos y nos convirtamos del mal al bien.
        <FootnoteRef number={23} />
        Por lo tanto, no es menos necesario para nosotros ahora que en los días de los
        apóstoles, que “nos convirtamos de las tinieblas a la luz”, o, en otras palabras,
        del poder oscuro de Satanás al poder de Dios, que es luz,
        <FootnoteRef number={24} />
        para que cada uno pueda experimentar la obra de redención y salvación realizada en
        y para sí mismo. Porque no basta con creer que Cristo murió, si no experimentamos
        los benditos efectos de Su muerte, quien vino a salvarnos de nuestros pecados (no
        en ellos), y a bendecirnos por medio de apartarnos de nuestras iniquidades. Porque
        leemos que Cristo se entregó a Sí mismo por nosotros para “redimirnos de toda
        iniquidad y purificar para Sí un pueblo propio celoso de buenas obras.”
        <FootnoteRef number={25} />
      </MdxP>
      <MdxH2 id="condicion-caida">
        La Condición Caída del Hombre y La Necesidad de una Nueva Vida
      </MdxH2>
      <MdxP>
        Porque creemos que tal es el estado natural del hombre en la caída, que por
        naturaleza estamos muertos para con Dios,
        <FootnoteRef number={26} />
        separados de Él, propensos al mal y a satisfacer los deseos de nuestra mente
        carnal, dominados por los deseos corruptos y pecaminosos de la carne,
        <FootnoteRef number={27} />
        y bajo el poder de un rey extraño, gobernados por el príncipe de la potestad del
        aire.
        <FootnoteRef number={28} />
        De modo que, así como nuestro hombre interior está muerto para Dios, no podemos
        hacer uso de nuestros sentidos espirituales
        <FootnoteRef number={29} />
        con Él, ni este hombre natural puede percibir, conocer o saborear las cosas de
        Dios, que solo se disciernen espiritualmente.
        <FootnoteRef number={30} />
        Por lo tanto, a pesar de que nuestro Salvador murió por nosotros, todavía por
        naturaleza nos encontramos en una condición miserable y perdida, en cautiverio del
        enemigo de nuestra alma, a menos que experimentemos al segundo Adán, el Señor del
        cielo, ese Espíritu vivificante, que pueda avivar nuestras almas y hacernos vivir
        para Dios nuevamente.
        <FootnoteRef number={31} />
        De modo que, al ser restaurados en el uso de nuestros sentidos internos, podamos,
        con la ayuda de Su Luz Divina (con la cual, para ese fin, ha bendecido a todos los
        hijos e hijas de los hombres <FootnoteRef number={32} />) vernos en esa triste y
        perdida condición bajo la ira de Dios,
        <FootnoteRef number={33} />
        y aborrecernos a nosotros mismos por ello. Y, en este sentido vivo (en el que las
        cosas se ven muy diferentes que antes) podamos clamar a Dios para ser liberados de
        esa condición, con una tristeza tan sincera y profunda que produce un verdadero
        arrepentimiento.
        <FootnoteRef number={34} />
      </MdxP>
      <MdxH2 id="salvaction-por-cristo">Salvación por medio de Cristo</MdxH2>
      <MdxP>
        No es ser rociados con agua cuando somos bebés lo que nos hará verdaderos
        cristianos, ni lo que nos convertirá de ser hijos de ira a ser hijos de gracia,
        hijos de Dios, miembros de la iglesia de Cristo, y nos dará una herencia en Él.
        <FootnoteRef number={35} />
        Tampoco es aprender nuestro catecismo y estar de acuerdo con ciertos artículos de
        fe (por muy ortodoxos que sean), ni ser educados en una creencia histórica de lo
        que Cristo hizo por nosotros hace más de mil seiscientos años. No, esto no
        proporcionará un conocimiento suficiente, verdadero y salvífico de Cristo, ni nos
        dará una participación real en Su muerte y sufrimientos; porque las personas
        pueden hablar de esto y complacerse con ello, y aun así seguir completamente
        atados bajo el dominio de Satanás (quien todavía gobierna dondequiera que haya
        desobediencia). Pero el conocimiento verdadero y salvífico de Cristo es
        experimentar nuestras almas vueltas de las tinieblas a la luz, del poder de
        Satanás al poder de Dios,
        <FootnoteRef number={36} />
        para que por medio de Él podamos ser librados del poder de las tinieblas, ser
        trasladados al reino de Su amado Hijo,
        <FootnoteRef number={37} />
        y experimentar Su poder salvífico realmente rescatándonos y redimiéndonos de
        debajo del poder de aquel que nos ha esclavizado,
        <FootnoteRef number={38} />
        y que lleva cautivos a su voluntad a aquellos que viven en la vanidad de sus
        mentes. Sí, es experimentar a Cristo atando a este hombre fuerte, saqueando sus
        bienes, despojándolo y echándolo fuera;
        <FootnoteRef number={39} />
        es sentir a Cristo sentándose en nuestras almas como un refinador que quema,
        consume, destruye, limpia y purifica completamente todo lo que es contrario a Él;
        <FootnoteRef number={40} />
        a fin de lavarnos y hacernos puros para que tengamos derecho a una herencia en Él,
        y que, siendo limpiados y santificados, Él pueda morar en nosotros, ejercer Su
        poder real y obrar en nosotros tanto el querer como el hacer por Su buena
        voluntad.
        <FootnoteRef number={41} />
      </MdxP>
      <MdxP>
        La mente, al ser desenredada de esta forma, y haber quitado el yugo anterior,
        entonces las cosas viejas pasan y he aquí todas son hechas nuevas
        <FootnoteRef number={42} />
        —un nuevo y tierno “corazón de carne”
        <FootnoteRef number={43} />
        según la promesa, nuevos pensamientos, deseos, inclinaciones, afectos, palabras,
        acciones, un nuevo interior que produce también un nuevo exterior, sí, una
        criatura completamente nueva en Cristo,
        <FootnoteRef number={44} />
        la cual realmente tiene derecho a esos beneficios que les corresponden a los
        hombres a través de Él, mediante esa fe viva que Él engendra,
        <FootnoteRef number={45} />
        que agrada a Dios,
        <FootnoteRef number={46} />
        da victoria
        <FootnoteRef number={47} />y siempre lleva fruto para Él en toda buena obra. Y
        creemos que es ese sacrificio tan precioso que Cristo ofreció cuando Su sangre fue
        derramada en la cruz por nosotros, <em>junto con</em> esta obra interna de
        redención y regeneración así realizada en el alma mediante Jesucristo, lo que
        completa la salvación de todos los que han sido despertados, vivificados y
        librados por el poder y el Espíritu de Aquel que es el camino, la verdad y la vida
        de toda alma que verdaderamente vive para Dios; porque estos son capacitados para
        andar en ese santo camino de vida, verdad y paz que ha sido preparado desde la
        antigüedad para que los rescatados y redimidos caminen en él.
        <FootnoteRef number={48} />
      </MdxP>
      <MdxH2 id="condenacion-del-hombre">
        La Condenación del Hombre es por Causa de Sí mismo
      </MdxH2>
      <MdxP>
        Y creemos que Dios misericordiosamente espera con gran bondad y paciencia, para
        que los hombres se arrepientan, tocando la puerta del corazón de cada uno,
        <FootnoteRef number={49} />
        ofreciendo libremente (y sin imponer) Su ayuda
        <FootnoteRef number={50} />
        en esta tan importante obra y cambio en los corazones de los hombres; de modo que
        en el día en que Dios juzgará al mundo por Jesucristo y en el que toda cosa
        secreta será manifestada, Dios será justificado y estará libre de la sangre de
        todo hombre. En verdad, en ese día toda boca se cerrará y la condenación de cada
        hombre será por causa de sí mismo, por haber rechazado el día de su visitación en
        el cual Dios llama al hombre y le ofrece la reconciliación, y por haber resistido
        las contiendas y menospreciado las reprensiones del Espíritu, que en Su infinita
        misericordia les ha dado a los hombres para instruirlos, mostrarles y guiarlos en
        el camino de vida y paz.
        <FootnoteRef number={51} />
      </MdxP>
      <MdxH2 id="nuevo-nacimiento">
        Regeneración o Nuevo Nacimiento Vivido, y no sólo Creído
      </MdxH2>
      <MdxP>
        Creemos que, aunque la depravación de la naturaleza del hombre en la caída es tal
        que el hombre natural o carnal (que <em>es</em> enemistad contra Dios en el estado
        de mera naturaleza) solo se ocupa de las cosas de la carne, y naturalmente produce
        las obras de la carne y no puede agradar a Dios, ni guardar ni observar Sus leyes,
        sino que es propenso al mal;
        <FootnoteRef number={52} />
        sin embargo, aquellos que abrazan la visitación de Dios y realmente experimentan
        la regeneración y un nuevo nacimiento de la Semilla incorruptible por la Palabra
        de Dios que vive y permanece para siempre
        <FootnoteRef number={53} />
        —esa Palabra implantada
        <FootnoteRef number={54} />
        que es viva y eficaz
        <FootnoteRef number={55} />
        y capaz de salvar y santificar el alma
        <FootnoteRef number={56} />
        —nacen de una nueva vida, son investidos con otro poder superior, se vuelven
        espirituales, y por el Espíritu obtienen libertad para caminar conforme al
        Espíritu
        <FootnoteRef number={57} />
        y producir Sus frutos. Estos reciben del Espíritu la capacidad de servir a Dios de
        manera aceptable, siendo ahora guiados por el Espíritu de Dios y hechos Sus hijos,
        quienes son enseñados por Él, y a través del Espíritu de adopción que recibieron
        en sus corazones
        <FootnoteRef number={58} />
        tienen el derecho a llamar a Dios su Padre y a Jesús su Señor. Porque habiendo,
        por el Espíritu, hecho morir al viejo hombre o primera naturaleza, y lo han
        despojado junto con sus inclinaciones corruptas y depravadas y sus malas obras, y
        habiendo crucificado la carne con sus pasiones y deseos, se han revestido del
        hombre nuevo y celestial, que es creado según Dios en justicia y verdadera
        santidad.
        <FootnoteRef number={59} />
        Y estos, siendo renovados en el espíritu de sus mentes, ahora caminan en novedad
        de vida,
        <FootnoteRef number={60} />y están verdaderamente en Cristo, y por lo tanto son
        transformados y convertidos en nuevas criaturas, y ahora piensan y actúan bajo la
        dirección de un Espíritu superior al que los gobernaba anteriormente, teniendo sus
        mentes elevadas a una región por encima de la naturaleza caída, de modo que ahora
        la corriente de sus pensamientos, deseos y acciones, fluye en otra dirección, y la
        inclinación de sus afectos está hacia aquellas cosas que son de arriba, donde está
        Cristo.
        <FootnoteRef number={61} />
        Porque ahora se ha abierto un ojo en ellos que ve más hermosura y belleza
        trascendentes en los tesoros invisibles y eternos del Señor, que en todos los
        placeres pasajeros que este mundo puede ofrecer.
      </MdxP>
      <MdxP>
        Y creemos que cualquiera que espera que la justicia de Cristo le sea imputada,
        debe de esta manera vestirse del Señor Jesucristo,
        <FootnoteRef number={62} />
        y ser así cubiertos y revestidos de Su justicia, y en una medida tener Su santa
        vida manifestada en y a través de ellos, y experimentarlo a Él vivificando e
        influyendo en sus mentes, y obrando en y por ellos. Estos saben que sin Él nada
        pueden hacer, pero que por medio de Él que los fortalece pueden hacer todo lo que
        Él les mande, y mientras permanezcan como pámpanos vivos en Él (por medio de esa
        savia y virtud que reciben diariamente de Él), son capacitados para llevar frutos
        que agradan a Dios,
        <FootnoteRef number={63} />
        por lo cual es glorificado.
        <FootnoteRef number={64} />
        Porque aunque Dios el Padre nos acepta en Cristo, y por amor a Él, aun así, este
        nuevo nacimiento es la calificación indispensable, y la verdadera marca distintiva
        de aquellos que están realmente en Él. “Si alguno está en Cristo, nueva criatura
        es; las cosas viejas pasaron, he aquí todas son hechas nuevas.”
        <FootnoteRef number={65} />
        Juan dice, “El que dice que permanece en Él, debe andar como Él anduvo.”
        <FootnoteRef number={66} />
      </MdxP>
      <MdxH2 id="todo-es-por-gracia">
        Todo es por Gracia, pero la Gracia no ofrece Libertad a la Carne
      </MdxH2>
      <MdxP>
        No atribuimos nada al hombre, como si tuviera poder o capacidad en o por sí mismo
        para agradar a Dios, sino que toda capacidad para hacer el bien se atribuye
        solamente a Cristo,
        <FootnoteRef number={67} />
        en quien únicamente el Padre se complace. Es a través de Él que los hombres son
        capacitados para amar y temer a Dios de tal manera que se aparten del mal y hagan
        esa justicia que le es agradable.
        <FootnoteRef number={68} />
        Y por esto, el hombre debe depender diariamente del Señor, para recibir de Él las
        provisiones adecuadas que (mediante una vigilancia constante) le permitan
        continuar en Su favor y gozar de Su benevolencia. Porque no es como muchos parecen
        imaginar, o como desearían que fuera, que puedan vivir en pecado y desobediencia
        aquí, entregándose a sus inclinaciones corruptas, y aun así esperar que se les
        impute la justicia de Cristo en el porvenir.
        <FootnoteRef number={69} />
        Porque, aunque no estamos bajo la ley mosaica, de manera que estemos obligados a
        cumplir sus ordenanzas, lavamientos y sacerdocio levítico (pues Cristo, nuestro
        Sumo Sacerdote se ofreció a Sí mismo una vez por todas y la cumplió); sin embargo,
        tampoco estamos bajo una gracia que nos exima de vivir bien. Aunque no estamos
        atados a los ritos y ceremonias de la ley, sí estamos obligados a cumplir con su
        justicia,
        <FootnoteRef number={70} />
        la cual Cristo no vino a abrogar sino establecer.
        <FootnoteRef number={71} />
        Y aunque Dios es misericordioso y compasivo para perdonarnos nuestras ofensas a
        través de la mediación de Cristo, siempre que haya un arrepentimiento verdadero y
        sincero, y que de corazón nos apartemos del mal;
        <FootnoteRef number={72} />
        esto no significa que podamos tomar la libertad de seguir en pecado y rebelión
        contra él. Sin duda, no debemos pecar porque Dios es misericordioso, con la idea
        de que Su gracia abunde;
        <FootnoteRef number={73} />
        si fuera así, ¿dónde estaría la estrechez del camino de Cristo? Si debemos tomar
        una cruz diaria en contra de nuestra propia voluntad para poder cumplir la de Él,
        díganme, ¿qué lugar hay para la libertad de la carne?
      </MdxP>
      <MdxP>
        Aquellos que están verdaderamente en Cristo (lo que nos hace aceptables al Padre,
        y completamente desposados con Él) deben necesariamente haber renunciado a su
        propia voluntad como un efecto del verdadero amor, una parte esencial de una unión
        tan íntima; y de esto proviene inevitablemente la obediencia. El apóstol
        Juan—después de haber declarado que Dios es Luz, y que aquellos que desean
        experimentar la sangre purificadora y la verdadera comunión con Él y de uno con el
        otro, deben andar en la Luz como Él está en la Luz
        <FootnoteRef number={74} />
        —les dice a los jóvenes y débiles en la fe (a quienes llama hijitos) que escribió
        esas cosas para que no pequen.
        <FootnoteRef number={75} />
        Sin embargo, si alguno, por debilidad o descuido, pecara y cayera en el desagrado
        del Padre, él les asegura que Cristo el justo es tanto la propiciación como
        también el abogado que intercede ante el Padre. También les dice que el guardar
        Sus mandamientos era la evidencia más segura de que lo conocían y estaban en Él.
        <FootnoteRef number={76} />
        Pero en cuanto a los fuertes, a quienes llama jóvenes, les dice que la Palabra de
        Dios permanecía en ellos, y que habían vencido al maligno.
        <FootnoteRef number={77} />
      </MdxP>
      <MdxH2 id="profesion-vs-posesion">Profesión vs Posesión del Cristianismo</MdxH2>
      <MdxP>
        Estas cosas pueden ser fácilmente habladas y comprendidas en la mente, pero
        experimentarlas cumplidas en nosotros es nuestro mayor interés, y solo esto puede
        hacernos partícipes de ellas. La esencia del cristianismo no consiste en tener
        nuestras cabezas saturadas de conocimiento, sino en tener nuestros corazones
        llenos del amor divino, que nos anima y empodera a ser diligentes, e inspira en
        nosotros valor y poder para guardar y cumplir la voluntad de Dios.
        <FootnoteRef number={78} />
        Porque Dios no mira lo que las personas profesan con sus labios, ni por qué nombre
        son llamados, sino que considera el corazón y el espíritu que lo gobierna. Las
        personas pueden profesar las mejores cosas y, aun así, seguir viviendo para sí
        mismas. Pueden cambiar su opinión o persuasión, y aun así no volverse de las
        tinieblas a la luz, ni del poder de Satanás a Dios.
      </MdxP>
      <MdxP>
        Ha habido, en efecto, una profesión externa del cristianismo muy grande y
        atractiva en el mundo, adornada con conceptos ingeniosos, elaborados y elevados,
        pulida con retórica y elocuencia; pero el poder y la vida que alcanzan el corazón
        y dan victoria y dominio sobre los deseos y afectos que batallan contra el alma,
        es algo que muchos todavía desconocen. En verdad, pocos han experimentado sus
        almas caídas restauradas de su primer estado en Adán, levantadas a un estado donde
        pueden percibir las cosas de Dios, recibir poder para hacer Su voluntad,
        experimentar sus mentes renovadas, y sentir aquel poder vencido que antes los
        mantenía cautivos, habiendo sido leudados por el don celestial en Su propia
        naturaleza. Esta es la verdadera vida y esencia de esa religión sobre cuyos
        aspectos externos el mundo está lleno de ruido; y, por lo tanto, la tarea más
        apropiada y necesaria de nuestras vidas es encontrar el cumplimiento de esta gran
        salvación <em>en nosotros.</em> La experiencia práctica de esta salvación en el
        corazón, por medio de la gracia salvadora y “el Espíritu de Dios que es dado al
        hombre para provecho,”
        <FootnoteRef number={79} />
        dará más satisfacción y contentamiento al alma que busca sinceramente el reino de
        los cielos y su justicia, que escuchar y leer todos los días acerca de lo que Dios
        ha hecho en el pasado por aquellos que verdaderamente lo amaban y le temían. Y es
        por la falta de esto que la religión cristiana es generalmente tan vacía e incapaz
        de producir una vida verdaderamente piadosa, acompañada de los frutos del Espíritu
        y de la debida obediencia que proviene de ese nacimiento del Espíritu, sin el cual
        los métodos más refinados de adoración y devoción no nos harán aceptos ante Dios,
        quien es inaccesible para el nacimiento de la carne. Tampoco creemos que sea
        agradable para Dios que las personas le canten esas canciones y salmos que fueron
        las experiencias y ejercicios espirituales de hombres santos en tiempos pasados,
        sin haber tenido alguna experiencia viva de las mismas cosas en sí mismas; ni que
        las personas puedan hablar de manera adecuada y verdadera sobre las cosas de Dios
        más allá de lo que han conocido y experimentado.
        <FootnoteRef number={80} />
      </MdxP>
      <MdxH2 id="el-don-de-la-luz">
        El Don de la Luz y Espíritu de Cristo en el Corazón
      </MdxH2>
      <MdxP>
        Ahora bien, ¿dónde, entre todas estas sólidas verdades evangélicas y escriturales
        se encuentra ese “veneno latente” tan temido y mencionado por nuestros
        adversarios? ¿Acaso está en que proclamamos el amor infinito de Dios hacia la
        humanidad, no solo al proporcionar libremente (por Su pura gracia y favor) un
        sacrificio mediante el cual se efectuó la propiciación por los pecados pasados del
        hombre, disponible para{` `}
        <em>todo aquel</em> que crea, se arrepienta y se vuelva a Dios;
        <FootnoteRef number={81} />
        sino también al proporcionar <em>a todos</em> los medios necesarios para la fe, el
        arrepentimiento y la conversión? Porque creemos que Dios no exige imposibles de
        los hombres, sino que espera que aumenten el talento o mina que se les ha
        repartido, no solo al enviar al Hijo de Su amor a morir por sus pecados, para que
        ya no vivan más en ellos, sino también al enviar Su luz y Espíritu a sus
        corazones, para guiarlos y llevarlos a toda verdad. Y leemos que Él hace que Su
        gracia se manifieste para salvación a todos los hombres, a fin de instruirlos y
        enseñarles a renunciar a toda impiedad y a los deseos mundanos, a abandonar al
        diablo y todas sus obras, y las pompas y vanidades de este mundo impío; también a
        rescatarlos y salvarlos de vivir en los deseos pecaminosos de la carne, a
        ayudarlos y fortalecerlos para volver a Él en obediencia, y a vivir una vida
        sobria, justa y piadosa, guardando la santa voluntad y los mandamientos de Dios, y
        caminando en ellos todos los días de su vida.
        <FootnoteRef number={82} />
      </MdxP>
      <MdxP>
        Las Sagradas Escrituras dan abundante testimonio de este don de Dios dado al
        hombre, usando diferentes nombres, tales como Espíritu, luz, palabra, gracia,
        semilla, levadura, unción, etc., con los cuales entendemos que se refiere a ese
        Espíritu o talento celestial con el que Dios ha dotado a la humanidad en alguna
        medida para provecho.
        <FootnoteRef number={83} />
        Y en la experiencia de su incremento, mediante una diligente cooperación con él,
        con el fin de cumplir aquellos propósitos santos por los cuales lo hemos recibido,
        no tenemos duda de que estaremos felices al rendir una buena cuenta de nuestra
        mayordomía, y finalmente, entrar en el gozo de nuestro Señor.
        <FootnoteRef number={84} />
      </MdxP>
      <MdxP>
        Nuestros opositores también afirman tener el Espíritu y la gracia de Dios; de lo
        contrario ¿por qué hay tanta oración por Su ayuda, y tantos discursos elocuentes
        sobre ello con los que a veces cautivan a su audiencia? Tenemos la esperanza de
        que hagan esto con sinceridad, y no solo para embellecer y adornar sus sermones
        con un tema que ellos no pueden evitar, dado que las Escrituras están tan llenas
        de ese lenguaje. Pero si en realidad es algo genuino y sincero, entonces ¿por qué
        se considera un error y una falta en nosotros, cuando en ellos se cree que es algo
        correcto y apropiado?
      </MdxP>
      <MdxP>
        Y nos parece muy extraño que ellos consideren absurdo conceder que este don divino
        sea la Luz de Cristo brillando en la mente; ya que su función propia es enseñar e
        instruir, ser nuestro guía y gobernador, manifestar y señalar nuestro deber, así
        como hacer que estemos dispuestos y seamos capaces de cumplirlo. Si las
        amonestaciones piadosas y las vidas ejemplares de los buenos hombres fueron
        apropiadamente llamadas “luces del mundo,”
        <FootnoteRef number={85} />
        con mayor razón puede este don—que es la fuente de luz, y que ilumina e informa
        aún más claramente el entendimiento y lo hace útil—merecer ese nombre. Y si la
        gracia y Espíritu de Dios está en los corazones de los hombres, sin duda no
        permanecerá completamente inactivo, sino que estará haciendo algunos intentos para
        lograr el fin para el cual fue puesto allí.
        <FootnoteRef number={86} />
        En ciertos momentos, estará atacando a sus enemigos y tratando de desplazar lo que
        es contrario; pues, al ser santo y puro por naturaleza, nunca puede reconciliarse
        con el pecado y la maldad, sino que siempre peleará contra ellos. En verdad, a
        medida que los hombres le prestan atención a este don de gracia, puede conocerse
        infaliblemente por la naturaleza de sus esfuerzos.
      </MdxP>
      <MdxP>
        Y nos atrevemos a apelar incluso a toda la humanidad, preguntándoles si no
        encuentran algo puesto en sus mentes y conciencias que, aunque quizás no esté
        gobernando ahí, nunca se mezcla con sus malas obras, ni las consiente, sino que
        siempre permanece puro y da testimonio contra ellas, convenciéndolos,
        reprendiéndolos y condenándolos por ellas, y también muchas veces (cuando sus
        espíritus están más quietos) les manifiesta la condición de sus almas.
        <FootnoteRef number={87} />
        ¿No hay algo en todos que, por así decirlo, razona con ellos, descubriendo la
        maldad de sus caminos, llamándolos secretamente a salir de ella, algo que a veces
        genera deseos e inclinaciones de buscar a Dios y de reconciliarse con Él? Ahora
        bien, dado que el hombre en su estado natural está totalmente muerto y caído de
        Dios hasta tal punto que no puede por sí mismo tener un buen pensamiento;
        <FootnoteRef number={88} />
        y puesto que Dios mismo es el único bien esencial, es evidente que este don en
        nosotros procede necesariamente de Él. Este don de gracia o luz en nosotros que
        siempre nos reprende por el vicio y la maldad,
        <FootnoteRef number={89} />
        ya sea en pensamiento, palabra u obra, que nos pone a considerar nuestro final, y
        a menudo hace que las personas giman en medio de la risa
        <FootnoteRef number={90} />
        —recordándoles que deben rendir cuentas, atrayéndolos hacia el cielo, e
        inclinándolos a la virtud y a la piedad, a hacer a todos los hombres como
        quisiéramos que ellos hicieran a nosotros, a ser justos, sobrios, misericordiosos,
        moderados, etc.—esto necesariamente debe ser algo que{` `}
        <em>no proviene de nosotros,</em> sino que es puro y sin mancha y de una
        naturaleza divina, que siempre inspira y eleva la mente hacia su origen.
      </MdxP>
      <MdxP>
        Por lo tanto, no puede ser una luz natural, ni la simple “luz de la naturaleza,”
        como afirman muchos, quienes sin embargo, a menudo hablan del Espíritu de Dios
        presente en el hombre. Porque es una verdad innegable que ningún poder puede
        actuar más allá de su propio ámbito, ni elevar al objeto sobre el cual actúa a una
        condición más noble que la suya, ni producir efectos que sean de una naturaleza
        más sublime que su propio origen. Además, es muy claro y evidente en las
        Escrituras que la mente del hombre a menudo es iluminada por una luz
        <FootnoteRef number={91} />
        superior a la de la mera razón, y que el hombre, con todo el poder y alcance de la
        razón y especulación humana, (aunque pueda llegar al conocimiento implícito de que
        existe un Dios) nunca puede alcanzar un conocimiento verdadero, espiritual y
        salvífico de Dios sin la ayuda de un poder divino y sobrenatural. Porque, aunque
        la mente del hombre, como ser racional, es esa capacidad o lámpara que puede ser
        iluminada, es Cristo quien debe iluminarla
        <FootnoteRef number={92} />
        para darnos un verdadero discernimiento de aquellas cosas que le pertenecen a Él y
        a Su Reino; y al unirnos y rendir obediencia a sus descubrimientos,
        experimentaremos un incremento de luz. El apóstol, hablando de lo que Dios por Su
        Espíritu les había revelado, dice claramente que el Espíritu todo lo escudriña,
        aún lo profundo de Dios; y que, así como nadie sabe las cosas del hombre, sino el
        espíritu del hombre que está en él, así tampoco nadie conoce las cosas de Dios,
        sino el Espíritu de Dios; y que el hombre natural ni conoce ni recibe las cosas
        del Espíritu de Dios porque se disciernen espiritualmente, y por esa razón habían
        recibido el Espíritu de Dios.
        <FootnoteRef number={93} />
        La luz natural se ocupa de cosas naturales, de esas cosas que están dentro de su
        propia región, actuando dentro de su propio ámbito, pero no puede alcanzar ese
        conocimiento de Dios que es vida eterna, a menos que nuestros poderes naturales o
        capacidades humanas sean iluminados por los rayos de la luz divina; pues, como
        dice el apóstol, el mundo mediante su sabiduría no conoció a Dios.
        <FootnoteRef number={94} />
        Y Cristo dice muy claramente y de manera positiva que nadie conoce al Padre sino
        el Hijo, y aquel a quien el Hijo lo quiera revelar.
        <FootnoteRef number={95} />
      </MdxP>
      <MdxP>
        La idea de que estas luchas internas en nosotros son las maquinaciones de Satanás,
        o que él inquiete o perturbe a los hombres por sus pecados, es decir, por
        servirlo, o que él mismo los incite a buscar libertad de su sujeción a su poder,
        parece absurdo de imaginar. De hecho, nuestro Salvador deja esto fuera de toda
        duda cuando pregunta: “¿Puede un reino dividido contra sí mismo permanecer?”
        <FootnoteRef number={96} />
        Y en otro lugar dice claramente que, mientras el hombre fuerte armado guarda su
        palacio, en paz está lo que posee, hasta que venga uno más fuerte que él para
        atarlo, etc.
        <FootnoteRef number={97} />
        Por lo tanto, es evidente que no es el diablo, sino más bien los tratos de un
        Poder superior los que quebrantan la paz de los hombres por causa del pecado, y
        los persiguen y condenan por su desobediencia y transgresión. Y únicamente este
        Poder supremo puede, y realmente quiere, redimir sus mentes de ese estado
        miserable, atar al hombre fuerte, quebrantar su poder y echarlo fuera, si tan solo
        unieran su voluntad a la de Él, y aceptar la liberación que ofrece.
      </MdxP>
      <MdxH2 id="visitacion-concedido">
        Un Día de Visitación Concedido a Todos los Hombres
      </MdxH2>
      <MdxP>
        Ahora bien, el hecho de que este don se ofrezca a todos los hombres, a lo largo de
        todas las edades, desde su juventud en adelante, no sugiere en absoluto que sea un
        don ni natural ni de poco valor. Muy por el contrario, esto demuestra que es de
        {` `}
        <em>mayor</em> importancia para todos los hombres. Porque el apóstol dice: “a cada
        uno le es dada una manifestación del Espíritu para provecho,”
        <FootnoteRef number={98} />
        y sabemos que las bendiciones y dones de Dios son gratuitos y valiosos debido a su
        valor intrínseco. En la naturaleza, Dios no estableció nada en vano, sino que
        aquellas cosas que son de mayor utilidad para sustentarnos y ayudarnos en nuestra
        vida natural son las más comunes, como el sol, que da luz a todos los hombres en
        todas las edades. El hombre evalúa las cosas según sus propios deseos, y las
        estima y valora más por su rareza y curiosidad, que por su utilidad; pero Dios
        concede de forma más universal aquello que es de la necesidad más absoluta para el
        hombre. ¿Acaso no se nos dice que todos los hombres nacen como extraños y enemigos
        de Dios, en la oscuridad y separados de Él en su estado natural,
        <FootnoteRef number={99} />
        y que por lo tanto deben ser iluminados, convertidos, regenerados y hechos seres
        espirituales antes de poder reconciliarse con Él? ¿No hará entonces Dios, que
        quiere que todos los hombres se arrepientan y sean salvos,
        <FootnoteRef number={100} />
        que la luz del Sol de Justicia resplandezca sobre todos, y conceda una medida de
        Su gracia y Espíritu a todos para ayudarlos a experimentar una obra en sí mismos
        que ellos no pueden hacer por sí mismos, pero que es de absoluta necesidad para su
        salvación? Por eso leemos que Dios, por medio de Su Espíritu, contiende con el
        hombre
        <FootnoteRef number={101} />
        durante el día de su visitación.
        <FootnoteRef number={102} />
      </MdxP>
      <MdxP>
        Puesto que hasta nuestros adversarios reconocen que el Espíritu, luz y gracia de
        Dios están en el hombre, a menos de que puedan demostrar que son de una
        naturaleza, tendencia y operación manifiestamente diferentes y superiores, o que
        sean distintos o contrarios a ese don del que hemos estado hablando, no vemos
        ninguna locura ni error en concluir que es una y la misma gracia y don de Dios que
        se ofrece a todos, que siempre es una misma en su naturaleza, aunque varía en sus
        medidas; y creemos que este es aquel “tesoro”
        <FootnoteRef number={103} />
        celestial que Dios nos ha confiado. Bienaventurados serán los que lo empleen
        correctamente, experimenten su incremento y den lugar y espacio a esta semilla del
        reino en sus corazones. Y aunque al principio puede parecer contrario a las
        expectativas del hombre—al verse pequeña, humilde y despreciable,
        <FootnoteRef number={104} />
        y ser en general ignorado entre las cosas con que las mentes de los hombres están
        llenas—sin embargo, si ellos simplemente unen su voluntad a este don, para que
        pueda ejercer su poder y fuerza en ellos, este crecerá y se incrementará. Sin
        duda, si dejan que esta levadura haga su obra perfecta, leudará toda la masa hasta
        convertirla en su propia naturaleza.
        <FootnoteRef number={105} />
      </MdxP>
      <MdxH2 id="cristo-morando-en-el-hombre">Cristo Morando en el Hombre</MdxH2>
      <MdxP>
        Por favor, consideren si realmente nos hemos merecido los insultos de nuestros
        adversarios al creer que el Señor escudriña el corazón del hombre, y le muestra
        sus pensamientos, y que no ha olvidado ser misericordioso al cumplir esas promesas
        generosas hechas en tiempos pasados a la descendencia de los gentiles, de poner Su
        ley en nuestros corazones y Su verdad en nuestro interior, y de derramar Su
        Espíritu sobre todos los hijos e hijas de los hombres, de volverse nuestro Maestro
        y de darnos el conocimiento de Sí mismo a través de la revelación de Su Hijo
        Jesucristo, quien ha venido para abrir nuestros ojos ciegos y sacar de la prisión
        a los que estábamos presos en tinieblas.
        <FootnoteRef number={106} />
        En verdad, Él ha prometido estar con Su pueblo hasta el fin del mundo, y nos ha
        dicho que Dios ha enviado al Consolador, el Espíritu de la Verdad, para
        recordarnos todo lo que Él dijo y para guiarnos y dirigirnos en el camino de la
        Verdad.
        <FootnoteRef number={107} />
        ¿Es justo que se burlen de nosotros por dar testimonio de la suficiencia y
        utilidad de las enseñanzas de esta unción santa enviada a nuestros corazones,
        <FootnoteRef number={108} />
        y por creer que, aunque Cristo está en Su cuerpo glorificado en el Cielo, también
        está presente en los corazones de Su pueblo?
        <FootnoteRef number={109} />
        Porque Él es el Rey de los Santos ¿y no reinará en ellos?
      </MdxP>
      <MdxP>
        El Alto y Santo, el que habita la eternidad, ha prometido también morar con los
        quebrantados y humildes,
        <FootnoteRef number={110} />
        para vivificar y consolar sus corazones. Así que, ¿no estará Aquel cuya presencia
        llena el cielo y la tierra también presente en el corazón del hombre? ¿No residirá
        en Su pueblo Aquel que se “regocija en la parte habitable de su tierra y cuyas
        delicias son con los hijos de los hombres”?
        <FootnoteRef number={111} />
        ¿No son ellos miembros de Él, y Él su cabeza? ¿Puede haber una unión y comunión
        más íntima que la que existe entre la cabeza y el cuerpo, entre la vid y los
        pámpanos?
        <FootnoteRef number={112} />
        El mismo Espíritu de vida que está en la cabeza, es también la vida del cuerpo, y
        actúa en él. El que está unido al Señor, un espíritu es con Él;
        <FootnoteRef number={113} />
        ¿y no pasa también la vida que está en la raíz a los pámpanos, y los mantiene
        vivos? ¿No se consideran “pámpanos muertos” todos aquellos en quienes no está esta
        vida? Todo aquel que tiene al Hijo de Dios y come de Él, tiene vida por medio de
        Él;
        <FootnoteRef number={114} />
        y los que no tienen a Cristo, quien es la vida de Sus santos, no tienen vida.
        ¿Cómo podría decirse que Su pueblo participa de Él en todas las edades si Él no
        estuviera presente en ellos?
        <FootnoteRef number={115} />
        Sin duda, esta doctrina no merece ser objeto de burla, más bien es de gran
        consuelo para aquellos que están enfermos de amor y tienen una sed ferviente de
        disfrutar de Él, y no solamente de oír de Él.
      </MdxP>
      <MdxH2 id="solo-un-cristo">Solo Un Cristo</MdxH2>
      <MdxP>
        Consideren seriamente estas cosas (que son acordes a las Escrituras), y con qué
        razón las personas se han burlado de nosotros por lo que creemos al respecto,
        llamándolo “El Cristo de los Cuáqueros,” como si Su manifestación en nuestros
        corazones fuera <em>otro Cristo,</em> o<em>un Cristo distinto</em> al Jesús de
        Nazaret que está glorificado con Dios el Padre en el cielo. Esto lo negamos de
        todo corazón; porque aunque Él ha ascendido al cielo y está sentado a la diestra
        de Dios muy por encima de todo principado y potestad, no está limitado o
        restringido a esto, sino que (tal y como por Él fueron hechas y creadas todas las
        cosas
        <FootnoteRef number={116} />) Él también es la vida que llena todo en todos en Su
        iglesia y pueblo. ¿Está dividida la divinidad y humanidad de Cristo? ¿No es esta
        inseparable unión el Cristo verdadero y completo? ¿Puede Su Deidad estar presente,
        y Aquel que es el hombre celestial estar ausente? ¿Qué piensan de Aquel que se le
        apareció a Juan, y le dio Su comisión para las siete iglesias?—a quien Juan
        describe (Apocalipsis 1:12-17), y quien dice: “He aquí, yo estoy a la puerta y
        llamo, si alguno oye mi voz y abre la puerta, entraré a él, y cenaré con él, y él
        conmigo.” El mismo que dice: “Yo soy el que escudriña la mente y el corazón; y os
        daré a cada uno según vuestras obras.”
        <FootnoteRef number={117} />
      </MdxP>
      <MdxP>
        ¿No es este el verdadero Cristo, el verdadero Mediador, por quien Dios juzgará al
        mundo?
        <FootnoteRef number={118} />
        ¿Y puede Él examinar tan de cerca la parte más íntima de la mente del hombre, de
        manera que ningún pensamiento escape a Su atención, si no está presente? ¿Por qué
        desearía Pablo que nuestro Señor Jesucristo estuviera con el espíritu de Timoteo,
        si pensara que tal cosa fuera imposible?
        <FootnoteRef number={119} />
        ¿Acaso no reconocen todos los cristianos que el Espíritu de Cristo, que es el
        Ungido, está <em>en</em> Su pueblo? Entonces ¿cómo puede estar ausente? ¿Acaso el
        hecho de que sea un misterio, muy por encima de nuestra capacidad de entender, es
        razón suficiente para decir que no es así? ¿No deberíamos en tales casos ejercitar
        la fe y aceptar el testimonio del Espíritu Santo expresado en las Sagradas
        Escrituras, en lugar de interponer nuestras sofisticadas y curiosas
        especulaciones? —no metiéndonos innecesariamente en cosas demasiado sublimes para
        nosotros, sino recordando que las cosas secretas le pertenecen a Dios, y que
        aquellos que conocen más en esta vida solo conocen en parte las cosas invisibles,
        y las ven como por un espejo.
        <FootnoteRef number={120} />
        ¿Deberían los hombres, que ni siquiera se comprenden a sí mismos, ni tienen
        conocimiento intuitivo de su esencia, o incluso de las cosas más pequeñas que la
        naturaleza nos presenta, y que son obvias para nuestros sentidos; digo, deberían
        ellos aspirar a comprender cosas mucho más inescrutables, y emprender explicar
        aquello que está fuera del alcance y comprensión de las mentes más dotadas?
      </MdxP>
      <MdxH2 id="librar-del-poder-del-pecado">
        Cristo Puede Librar del Poder del Pecado en esta Vida
      </MdxH2>
      <MdxP>
        Esperamos que no sea un error afirmar que el poder de Cristo es más fuerte que el
        del diablo, que Él es realmente capaz de atarlo, herir su cabeza,
        <FootnoteRef number={121} />
        quebrantar su poder, despojarlo y echarlo fuera, y cumplir completamente el
        propósito de Su venida, que es deshacer las obras del diablo y salvar de sus
        pecados a los que tienen verdadera fe en Su nombre y poder. Sin duda no es
        inconsistente con el cristianismo creer que Cristo{` `}
        <em>puede y quiere</em> purificar completamente Su era; que en verdad puede
        liberar al hombre de la cárcel, restaurarlo de su caída y llevarlo a Dios,
        <FootnoteRef number={122} />
        dándole poder para dejar al diablo y a todas sus obras, etc.
      </MdxP>
      <MdxP>
        Encontramos que es coherente con la Escritura y con la dispensación del evangelio
        creer que aquellos que han experimentado la regeneración y han nacido de nuevo del
        Espíritu, han hecho morir por el Espíritu la primera naturaleza carnal y corrupta
        <FootnoteRef number={123} />
        que no puede agradar a Dios. Y si esta naturaleza está muerta, y también ha sido
        destruida y enterrada, sin ninguna duda ya no vive, sino que la mente queda en
        libertad y es restaurada para actuar en novedad de vida, andar conforme al
        Espíritu y cumplir la justicia de la ley,
        <FootnoteRef number={124} />
        porque la ley del Espíritu de vida en Cristo Jesús los ha libertado de la ley del
        pecado
        <FootnoteRef number={125} />y de la muerte que es su paga.{` `}
        <em>
          Es por la falta de experimentar este verdadero nacimiento del Espíritu que se
          produce en el hombre, y de conocer en sí mismos la libertad que él otorga
        </em>
        —cosa que ningún deber o actuación de la voluntad humana, ni las opiniones más
        refinadas en religión, pueden administrar, salvo la ley del Espíritu de Cristo en
        sus corazones—es por esta falta, digo, que las personas se muestran tan temerosas
        ante la dificultad y tan prontas a declarar imposible que el hombre viva una vida
        santa y justa. No obstante, esto es tan necesario para nuestra salvación, que se
        nos dice que sin santidad no podemos ni entrar en el reino de los cielos, ni ver a
        Dios.
        <FootnoteRef number={126} />
        No es que el camino sea más ancho, ni que su paso sea menos angosto y difícil de
        lo que imaginan; porque es absolutamente imposible que el hombre camine en él
        mientras esté sumergido en su primera naturaleza corrupta y desenfrenada, la cual
        no puede guardar la ley de Dios. Pues en esta naturaleza, los deseos y las
        pasiones del hombre están fuera de control, sus afectos desordenados, sus
        voluntades no están sometidas, y siguen los deseos e inclinaciones perversas de su
        mente sin restricciones.
      </MdxP>
      <MdxP>
        Pero si llegan a experimentar otra semilla o poder que gobierne sus mentes, que
        cree en ellos corazones nuevos y limpios, que regule y sujete sus voluntades, que
        someta y dome sus pasiones, que limite sus deseos y dirija sus afectos e
        inclinaciones completamente hacia lo que es bueno, que corrija sus espíritus
        enteramente, y les enseñe a poner su mirada en las cosas de arriba, dándoles una
        aversión a todo mal, y un gran amor por la virtud y la bondad; al estar así
        perfectamente transformados, ¿dónde está ahora la gran dificultad? Porque “el
        hombre bueno, del buen tesoro de su corazón, saca buenas cosas.”
        <FootnoteRef number={127} />
        ¿No buscará y producirá esta nueva disposición interior (que ahora aborrece el mal
        y ama y se deleita en la justicia) lo que es bueno tan naturalmente como antes
        buscaba y producía lo malo? Aquí no hay que forzar la naturaleza del hombre, sino
        que él es convertido y leudado completamente en <em>otra naturaleza,</em> y (según
        su medida) hecho partícipe de la naturaleza Divina,
        <FootnoteRef number={128} />
        que es la única que puede hacer la voluntad de Dios.
      </MdxP>
      <MdxH2 id="diligencia-y-vigilancia">La Necesidad de Diligencia y Vigilancia</MdxH2>
      <MdxP>
        Les pedimos a nuestros vecinos inclinados a la piedad que sopesen y consideren
        seriamente la absoluta necesidad de que todo verdadero cristiano experimente sus
        mentes siendo moldeadas y formadas de nuevo por el poder y el Espíritu de Cristo
        obrando poderosamente en ellos,
        <FootnoteRef number={129} />
        para que puedan agradar a Dios con una vida santa y justa, escapando de la
        corrupción que hay en el mundo a causa de las concupiscencias. Y sabiendo que
        comprender esto en la mente es mucho más fácil que realmente alcanzarlo en el
        corazón, afirmamos que todos, con gran diligencia, deben entregarse fielmente a
        aquello que constituye el asunto principal y propio de esta vida. Por lo tanto,
        así como le ha placido a Dios darnos todas las cosas que pertenecen a la vida y a
        la piedad por Su divino poder,
        <FootnoteRef number={130} />
        nosotros debemos—con una atención vigilante, cooperando con esa gracia que se nos
        da para tal propósito (y no resistiéndola)—ocuparnos en nuestra salvación con
        temor y temblor;
        <FootnoteRef number={131} />
        sabiendo que un buen grado de logro en esto puede perderse rápidamente a menos que
        sostengamos una vigilancia constante y diligente en la mente en medio de todos los
        negocios y ocupaciones, manteniendo un control sobre nuestras palabras y
        pensamientos, y un fiel impulso hacia adelante. Porque mientras vivamos en este
        mundo somos propensos a caer en tentaciones, y es fácil que caigamos en ellas si
        no tenemos un cuidado y vigilancia estrictos,
        <FootnoteRef number={132} />
        ya que nuestros sentidos presentan muchos anzuelos a nuestra mente en todo
        momento, de los cuales Satanás se aprovecha para engañarnos. Y también hay muchas
        provocaciones que se presentan en nuestro peregrinaje, contra todas las cuales la
        gracia de Dios es una armadura suficiente,
        <FootnoteRef number={133} />a medida que nuestras mentes se van sazonando con
        ella, de modo que donde haya algún error o falla, es por nuestra propia
        insinceridad, negligencia u omisión.
      </MdxP>
      <MdxH2 id="el-amor-universal-de-dios">
        El Amor Universal de Dios y La Capacidad del Hombre para Rechazarlo
      </MdxH2>
      <MdxP>
        Tampoco es una “herejía peligrosa” que nosotros (junto a muchos otros profesantes
        del cristianismo) creamos en la universalidad del amor de Dios ofrecido a toda la
        humanidad. Porque leemos en las Escrituras que Dios es bueno para con todos, y que
        Sus misericordias están sobre todas las obras de Sus manos;
        <FootnoteRef number={134} /> y creemos que Él es sincero en su declaración (y que
        no pretende engañarnos) cuando afirma: “Vivo yo, dice Jehová el Señor, que no
        quiero la muerte del impío, sino que se vuelva y viva.”
        <FootnoteRef number={135} />
        Creemos que Dios, cuyo amor y misericordia no tienen límites,{` `}
        <em>ofrece</em> gratuita y generosamente la salvación por medio de Jesucristo
        (bajo ciertas condiciones que debemos cumplir de nuestra parte) a toda la
        humanidad, a cada hombre y mujer sobre la faz de la tierra,
        <FootnoteRef number={136} />
        lo cual es el verdadero mensaje del evangelio: “buenas nuevas de gran gozo, que
        serán para todo el pueblo; en la tierra paz y buena voluntad para con los
        hombres.”
        <FootnoteRef number={137} />
        Esto es, en verdad, un buen motivo para regocijarse; que todos están dentro del
        alcance de la misericordia y perdón gratuito;
        <FootnoteRef number={138} />
        que Dios no hace acepción de personas, sino que en toda nación el que le teme y
        hace lo justo por medio de Él, le es acepto.
        <FootnoteRef number={139} />
        Creemos que Cristo murió por los pecados de todo el mundo,
        <FootnoteRef number={140} />
        sí, por cada ser humano. Ciertamente, entonces, todos aquellos por quienes Él
        murió están en capacidad de experimentar la salvación;
        <FootnoteRef number={141} />
        porque la gracia que trae salvación se ha manifestado a todos los hombres,
        <FootnoteRef number={142} />
        y a cada uno le es dada la manifestación del Espíritu para provecho.
        <FootnoteRef number={143} />
        Y creemos que solo son condenados o reprobados aquellos que continúan
        voluntariamente sordos a los llamados de esta gracia,
        <FootnoteRef number={144} />
        que resisten al Espíritu,
        <FootnoteRef number={145} />
        y que esconden y menosprecian sus talentos durante el día de su visitación.
        <FootnoteRef number={146} />
        De estos Cristo finalmente se aparta y deja de contender con ellos; de modo que,
        al ser ahora retirados los medios, se les entrega a sí mismos
        <FootnoteRef number={147} />
        y a la dureza de corazón,
        <FootnoteRef number={148} />
        ya no percibiendo en sí mismos aquel don que pudiera prepararlos, ablandarlos y
        suavizarlos, de manera que son incapaces de arrepentirse, creer y convertirse.
      </MdxP>
      <MdxH2 id="eleccion-y-reprobacion">
        El Error de la Elección y la Reprobación Individual
      </MdxH2>
      <MdxP>
        Si creer esto es un “error peligroso y nocivo,” confesamos que somos culpables;
        porque no podemos convencernos de abrazar esa opinión antievangélica de que Dios,
        desde toda la eternidad, por un decreto inmutable, ha elegido de manera individual
        e incondicional—sin tener en cuenta si aceptan o rechazan la salvación ofrecida en
        Cristo—a algunos para salvación y a otros para condenación; de modo que aquellos
        que son así elegidos ciertamente serán salvados, hagan lo que hagan, pues el
        decreto de Dios no puede ser revocado. Tampoco podemos aceptar la idea de que
        aquellos que son reprobados hayan sido, en efecto, condenados miles de años antes
        de nacer, de modo que queden sin ninguna esperanza de salvación, sin importar cuán
        ferviente y diligentemente la busquen, o cuán deseosos estén de servir y agradar a
        Dios. Porque esto parece más bien ser “tristes nuevas para la mayoría de los
        hombres,” en lugar de “buenas nuevas para todos los hombres,” si fuese realmente
        cierto. Además, esto pone fin a todo el propósito de la religión, porque hace que
        toda adoración y devoción, toda predicación, oración, reunión y vida santa, sean,
        por así decirlo, inútiles, al invalidar todo lo que el hombre haga, considerándolo
        como algo que no contribuye en absoluto (como una condición necesaria por parte
        del hombre) ni a su salvación ni a su condenación eterna.
      </MdxP>
      <MdxP>
        En verdad, no podemos adoptar una opinión tan diametralmente opuesta a los
        atributos de Dios y a Sus repetidas declaraciones en contrario, y de esta manera
        atrevernos a acusar Su justicia, misericordia y bondad. No podemos creer tales
        cosas de Dios, quien es el amor mismo y la bondad misma, y que siempre ha
        manifestado un maravilloso cuidado y preocupación por el hombre como Su criatura
        amada; pues parece muy contrario a Su poder condenar a aquellos que no merecen ser
        castigados.
        <FootnoteRef number={149} />
        Y habiendo declarado claramente que no quiere la muerte del que muere,
        <FootnoteRef number={150} />
        parece absurdo sugerir que, sin embargo, creó a la mayor parte de la humanidad con
        el propósito de condenarlos, sin provocación alguna, y sin haberles ofrecido jamás
        la salvación; o que hiciera a la gran mayoría de los hombres completamente
        incapaces de aceptar la salvación que se les ofrece, al poner fuera de su alcance
        la capacidad de cumplir las condiciones y términos sobre los cuales Él la ofrece,
        y luego condenarlos a la miseria eterna por no cumplir aquello que les era
        imposible. Porque Dios no solo llama a todos los confines de la tierra (lo que
        implica a toda la humanidad) a mirarlo a Él y ser salvos,
        <FootnoteRef number={151} />
        sino que también ha dado a cada uno una porción de Su Espíritu para que pueda
        hacerlo. No solo envió a Su Hijo amado a gustar la muerte por todos los hombres,
        <FootnoteRef number={152} />
        a ser levantado como Moisés levantó la serpiente de bronce, a fin de que todo
        aquel que en él crea no se pierda;
        <FootnoteRef number={153} />
        sino que también Él los atrae,
        <FootnoteRef number={154} />y en la medida que están dispuestos a recibirlo, los
        toca con ese Imán Divino que es lo único que puede inclinar sus corazones y
        capacitarlos efectivamente para volver a la fuente de toda verdadera felicidad.
      </MdxP>
      <MdxP>
        Pero <em>esta</em> es la condenación: que la luz ha venido al mundo, y los hombres
        aman más las tinieblas que la luz, porque sus obras son malas, y aborrecen la luz,
        y no quieren llevar sus obras a la luz, para que no sean reprendidas.
        <FootnoteRef number={155} />
        Porque todas las cosas que son reprobadas son hechas manifiestas por la luz,
        <FootnoteRef number={156} />
        pero los hombres aman sus propios caminos amplios, para seguir los deseos de sus
        ojos y los deseos de sus mentes,
        <FootnoteRef number={157} />
        y por eso aborrecen ser limitados y reformados. El apóstol, animando a los Efesios
        a llevar una vida de pureza, y a evitar los varios males mencionados allí, dice
        claramente: “Nadie los engañe con palabras vanas, porque por estas cosas viene la
        ira de Dios sobre los hijos de desobediencia.”
        <FootnoteRef number={158} />
        Y en otro lugar, dice, “si vivís conforme a la carne, moriréis.”
        <FootnoteRef number={159} />
        La razón, por tanto, de que algunos se pierdan y sean condenados a perdición es su
        falta de abrazar los medios provistos por Dios. Es porque no llevan sus obras a la
        Luz de Cristo en sus corazones, ni prestan atención a las reprensiones que
        instruyen que son el camino de la vida,
        <FootnoteRef number={160} />
        ni siembran para el Espíritu y mediante el Espíritu hacen morir las obras de la
        carne,
        <FootnoteRef number={161} />y<em>no porque</em> hayan sido reprobados
        personalmente e incondicionalmente desde toda la eternidad. Dios, que es Señor de
        todos, es bueno para con todos y quiere que todos los hombres sean salvos;
        <FootnoteRef number={162} />
        pero muchos desobedecen Su llamado, rechazan Sus ofertas, resisten los esfuerzos
        de Su Espíritu, hacen oídos sordos a los toques que hace nuestro Salvador a la
        puerta de sus corazones
        <FootnoteRef number={163} />
        para que lo reciban y le den morada allí, escogen y prefieren el mundo presente y
        no se niegan a sí mismos para seguir a Cristo. No es como dicen algunos hombres,
        que la salvación nunca estuvo al alcance de ellos. ¿Acaso fueron lágrimas fingidas
        aquellas que nuestro Salvador derramó sobre Jerusalén cuando ya se había acabado
        el día de Su visitación?—cuando dijo: “¡Cuántas veces quise juntar a tus hijos,
        como la gallina a sus polluelos, y no <em>quisiste!</em>” Observen que no dijo:
        “no <em>pudiste.</em>”
        <FootnoteRef number={164} />
      </MdxP>
      <MdxP>
        Y si algunos se atreven a sostener una opinión tan despectiva hacia la justicia,
        misericordia, amor y cuidado paternal de Dios, y tan contraria al mensaje del
        evangelio, no podemos dejar de preguntarnos qué los llevaría a imponer esta
        doctrina a otros y a presentarla como si fuera un punto necesario de creer en la
        religión cristiana. Porque no podemos ver cómo esto puede generar amor a Dios,
        aumentar la fe en Cristo, elevar nuestra veneración por Él, motivar a la
        diligencia o fomentar la piedad, que es lo que realmente avanza la verdadera
        religión. Por el contrario, esta doctrina tiende a inducir a algunos a refugiarse
        en una falsa seguridad, y hacer que otros no le den mucha importancia a la muerte
        y sacrificio de Cristo, considerándolo como algo parcial. Por ella, algunos caen
        en la desesperación, y otros son alentados a satisfacer plenamente los deseos de
        sus mentes, ya que nada puede alterar ese supuesto decreto de Dios ni para un lado
        ni para otro.
      </MdxP>
      <MdxP>
        Sin embargo, no negamos la presciencia de Dios, quien conoce todas las cosas
        pasadas, presentes y futuras, estando todas ellas presentes ante Él a la vez; de
        modo que se puede decir con verdad que aquellos que creen en Cristo con esa fe
        viva y activa que obra por amor e impulsa a la obediencia, y que perseveran en
        ella hasta el fin, y así experimentan Su salvación, están en Aquel en quien la
        elección existía antes de que el mundo comenzara. Asimismo, aquellos que no creen,
        sino que más bien rechazan las ofertas de Su amor, y, al persistir en la
        desobediencia, descuidan una salvación tan grande, pueden considerarse ya
        condenados. Tampoco negamos esa prerrogativa de Dios de que algunos son hechos
        mayordomos sobre más talentos, y otros menos, según los cuales su incremento debe
        ser proporcional. Donde se da mucho, se demanda mucho,
        <FootnoteRef number={165} />
        y donde se da menos, se demanda menos; porque Dios es justo y equitativo en todos
        Sus caminos. Él no es un señor duro que exija o espere más que el incremento de lo
        Suyo.
        <FootnoteRef number={166} />
        Si aquel que recibió un solo talento lo hubiera utilizado y hecho dos, no dudamos
        que esto habría sido aceptado por el Señor; porque creemos que nadie está
        absolutamente excluido desde la eternidad de recibir algún talento, y que además
        se concede un tiempo en el que es posible incrementarlo. Así que, aunque la gracia
        puede obrar más poderosamente en algunos que en otros, todos quedan sin excusa.
      </MdxP>
      <MdxH2 id="una-vez-en-gracia">¿Una vez en Gracia, siempre en Gracia?</MdxH2>
      <MdxP>
        Hay otra opinión que depende de la doctrina mencionada anteriormente, que tampoco
        podemos aceptar (tal como ellos la expresan), y por eso nuestros adversarios
        piensan muy mal de nosotros; y es esta: que una vez que un hombre está en un
        estado de gracia, siempre permanecerá ahí; es decir, que no existe la posibilidad
        de caer de la gracia. No podemos entender cómo esta doctrina podría promover el
        verdadero celo y la piedad, ni mejorar la condición de la iglesia cristiana, ni
        vemos otra razón por la cual sus partidarios están tan aferrados a ella, excepto
        porque concuerda con la doctrina de la elección y la reprobación individual; de
        modo que los que abrazan una, se ven obligados a creer en la otra. Pero, al margen
        de esto, ciertamente tiende más a relajar a las personas que a estimularlas a
        aquel cuidado y diligencia necesarios, y a la constante y perseverante vigilancia
        en la oración, a la que nuestro Señor tanto nos exhortó, y a la que los apóstoles
        tan solícitamente instaron a los santos en todo lugar a permanecer, como siendo
        algo de absoluta necesidad.
      </MdxP>
      <MdxP>
        ¿Cuál es el significado de esas promesas de recompensa en el libro de Apocalipsis
        para aquellos que “venzan” y “permanezcan hasta el fin,” salvo alentar a la
        iglesia a perseverar constantemente? ¿O qué necesidad había de tales palabras si
        fuera imposible que se apartaran (quienes, supongo, nadie negará que estaban en un
        estado de gracia)? A la iglesia de Éfeso se le amenazó con quitar su candelero si
        no se arrepentía y hacía sus primeras obras; y la de Laodicea estaba a punto de
        ser vomitada de Su boca.
        <FootnoteRef number={167} />
        ¿Y quién puede decir que esas vírgenes insensatas en la parábola no estuvieron
        alguna vez en un estado de gracia, cuyas lámparas al principio estaban encendidas,
        arregladas y ardiendo? Porque, ¿de qué otra manera podría decirse apropiadamente
        que habían salido a recibir al Esposo?
        <FootnoteRef number={168} />
        ¿O quién puede decir que aquellos no fueron llamados por la gracia salvadora, en
        cuyos corazones brotó la semilla celestial y por un tiempo prosperó, hasta que los
        espinos y cardos, los afanes y preocupaciones de esta vida la ahogaron?
        <FootnoteRef number={169} />
        Claramente, no fue porque no tuvieran un día de visitación de parte de Dios en el
        cual pudieran haber ocupado su salvación con temor y temblor, si hubieran
        continuado haciendo del reino de los cielos y su justicia su primera y principal
        elección, poniendo su tesoro allí y desenredándose de esas preocupaciones
        innecesarias. No, la semilla que fue sembrada y comenzó a brotar en estos fue{` `}
        <em>la misma semilla</em> que en el corazón honesto dio fruto abundantemente.
      </MdxP>
      <MdxP>
        Seguramente Pablo, aquel gran apóstol, no compartía la opinión de estos hombres,
        cuando después de haber trabajado mucho tiempo en el evangelio, dijo: “Yo golpeo
        mi cuerpo, y lo pongo en servidumbre, no sea que habiendo sido heraldo para otros,
        yo mismo venga a ser eliminado.”
        <FootnoteRef number={170} />
        ¿Quién no reconocerá que el apóstol, cuando escribió estas palabras, estaba en un
        estado de gracia? Y el autor de la carta a los Hebreos escribiendo en el tercer
        capítulo a aquellos a quienes llama “hermanos santos” y “participantes del llamado
        celestial,” en el versículo 12, les exhorta: “Mirad, hermanos, que no haya en
        ninguno de vosotros corazón malo de incredulidad para apartarse del Dios vivo.” Y
        nuevamente, en el capítulo 4:1: “Temamos, pues, no sea que permaneciendo aún la
        promesa de entrar en su reposo, alguno de vosotros parezca no haberlo alcanzado.”
        Verso 11: “Procuremos, pues, entrar en aquel reposo, para que ninguno caiga en
        semejante ejemplo de desobediencia.” De nuevo, capítulo 6 versículos 4-6, hablando
        de aquellos que habían sido iluminados, habían gustado del don celestial, habían
        sido hechos partícipes del Espíritu Santo, habían gustado de la buena palabra de
        Dios y los poderes del siglo venidero (mostrando señales de que realmente habían
        sido llamados y estaban en un estado de gracia), dice que si cayeran, sería
        imposible renovarlos otra vez para arrepentimiento;{` `}
        <em>no porque hubieran sido condenados desde la eternidad,</em> sino porque
        “crucificaban de nuevo para sí mismos al Hijo de Dios,” porque contristaban a Su
        buen Espíritu, y rechazaban los medios.
      </MdxP>
      <MdxP>
        Nuestro Salvador dice de Sí mismo: “Yo soy la vid verdadera, vosotros los
        pámpanos; mi Padre es el labrador, todo pámpano que en mí no lleva fruto, lo
        quitará.” De nuevo, “El que en mí no permanece, será echado fuera como pámpano, y
        se secará.”
        <FootnoteRef number={171} />
        Sin duda, debe afirmarse que mientras ellos permanecen siendo pámpanos en Cristo,
        son aceptados por el Padre; y, sin embargo, parece claramente posible que se
        aparten y sean cortados como pámpanos secos. Por esto Cristo repite a menudo esta
        {` `}
        <em>condición:</em> “<em>Si</em> permanecéis en Mí;” y enseguida dice que la
        manera de permanecer en Su amor era hacer Su voluntad, como Él había hecho la de
        Su Padre, y así permanecía en Su amor.
        <FootnoteRef number={172} />
        Pero aunque no podemos abrazar la opinión de nuestros opositores, y debemos
        mantenernos firmes en las declaraciones de la Escritura que demuestran ampliamente
        cómo un hombre puede avanzar en la gracia, y sin embargo, por falta de una
        vigilancia cuidadosa y constante en esa gracia, puede apartarse; también creemos
        que existe tal estado y crecimiento en la gracia mediante una atención vigilante a
        ella, y tal medida de fe alcanzable, del que ya no hay posibilidad de caer.
        <FootnoteRef number={173} />
      </MdxP>
      <MdxH2 id="sacramentos">Los Sacramentos (así llamados)</MdxH2>
      <MdxP>
        Pero eso que parece ser nuestro “error capital,” y la más grave de todas sus
        acusaciones, y aquello que parece silenciar todas las demás defensas en nuestro
        favor, es que no practicamos los sacramentos (así llamados) del bautismo, y del
        pan y el vino.
      </MdxP>
      <MdxH3 id="bautismo">Bautismo</MdxH3>
      <MdxP>
        Juan, como el precursor inmediato de Cristo para preparar Su camino, dio una
        alarma a los judíos que se sentían seguros bajo la ley de Moisés, proclamándoles
        que el reino de los cielos estaba cerca, y que había llegado el tiempo en que Dios
        mandaba tanto a los judíos como a todos los hombres en todas partes a
        arrepentirse.
        <FootnoteRef number={174} />
        No era suficiente para ellos seguir pecando y luego ofrecer los respectivos
        sacrificios que la ley requería por ello; porque ahora la ira de Dios estaba
        próxima a ser revelada desde cielo contra toda impiedad e injusticia de los
        hombres.
        <FootnoteRef number={175} />
        No bastaba adornar o limpiar el exterior de la copa y del plato, sino que el
        interior debía ser limpiado, y entonces el exterior también sería limpio. El hacha
        ya estaba puesta a la raíz, y todo árbol que no diera buen fruto sería cortado.
        <FootnoteRef number={176} />
      </MdxP>
      <MdxP>
        La ley de Moisés se ocupaba de los actos externos y no podía hacer perfectos a los
        hombres en cuanto a la conciencia;
        <FootnoteRef number={177} />
        pero se estaba a punto de establecer una dispensación que se acercaba más al
        corazón, tomando en cuenta los mismos pensamientos, donde al pecado no se le
        permitiría ni siquiera ser concebido al unir la voluntad a él.
        <FootnoteRef number={178} />
        Por lo tanto, Juan fue enviado a administrar el bautismo de arrepentimiento como
        una figura viva de lo que vendría inmediatamente después; porque el bautismo de
        Juan no era capaz de producir este efecto en el corazón. Y él mismo testificó, que
        aunque él los bautizaba con agua, vendría después Uno (que era antes de él, y
        mucho más poderoso que él) que los bautizaría con el Espíritu Santo y fuego; cuyo
        aventador estaba en Su mano, y que limpiaría completamente Su era.
        <FootnoteRef number={179} />
        Esta es la gran obra que debe realizarse bajo la dispensación del evangelio de
        Cristo: quitar los pecados del mundo y destruir las obras del diablo;
        <FootnoteRef number={180} />
        purificar los corazones de las personas, y renovar sus mentes por el poder del
        Espíritu. Este es el efecto propio del bautismo eterno de Cristo. Como dice Pedro,
        “no quitando las inmundicias de la carne, sino dando testimonio de una buena
        conciencia delante de Dios,”
        <FootnoteRef number={181} />
        purificando nuestras conciencias de obras muertas, para que sirvamos al Dios vivo
        en novedad de vida.
      </MdxP>
      <MdxP>
        El bautismo de Cristo es uno solo, y los que por él han sido bautizados en Cristo
        Jesús, son bautizados en Su muerte, siendo su viejo hombre crucificado con Él,
        para que el cuerpo del pecado sea destruido y ya no sirvan más al pecado; porque
        los que han muerto con Cristo están libres del pecado, y vivos para Dios,
        <FootnoteRef number={182} />
        para llevar una vida santa y justa. Estos son los benditos efectos del bautismo
        del Espíritu Santo y fuego, y los beneficios que reciben aquellos que son
        verdaderamente lavados por Cristo en ese santo lavacro que nos da derecho a una
        parte con Él.
        <FootnoteRef number={183} />
        Ahora, creemos que{` `}
        <em>
          nuestro principal deber es experimentar este bautismo espiritual e interno de
          Cristo,
        </em>
        {` `}a fin de que nuestros corazones sean lavados, purificados y santificados por
        el Espíritu de Dios;
        <FootnoteRef number={184} />
        y que realmente nos vistamos de Cristo, y estemos en Él, que es la sustancia, en
        quien los tipos y sombras han terminado. Juan sabía y dijo de antemano que “él
        debía menguar, y Cristo crecer.”
        <FootnoteRef number={185} />
        Noten que no dice: “Inmediatamente cesaré, en cuanto tenga lugar el bautismo de
        Cristo;” sino más bien “yo debo menguar.” Pero si el bautismo en agua fuera
        destinado a continuar siempre entre los cristianos, entonces Juan no hubiera
        menguado en absoluto. Tampoco resuelve el problema la siguiente alegación: que el
        bautismo en agua fue abolido como perteneciente a Juan, pero luego se restableció
        como perteneciente a Cristo; pues, entonces Cristo tendría{` `}
        <em>dos</em> bautismos evangélicos (uno con el Espíritu, y otro con agua), lo cual
        es erróneo.
      </MdxP>
      <MdxP>
        Reconocemos que algunos de los apóstoles utilizaron el bautismo con agua durante
        un tiempo, pero creemos que fue más en conformidad con las circunstancias de la
        época que por necesidad, y por consideración a la debilidad de los creyentes en la
        infancia de la iglesia, siendo incluso la misma época en la que Juan había
        bautizado, quien no solo fue un verdadero mensajero de Dios en su tiempo, sino que
        también había ganado gran credibilidad entre la gente, y su memoria y mensaje no
        podían olvidarse tan rápidamente. Tampoco era fácil apartar a las personas de una
        práctica que había sido reconocida poco antes como de autoridad divina. Y además
        observamos que los apóstoles toleraron que los judíos creyentes vivieran en
        ciertos ritos y ceremonias de la ley mosaica por un tiempo,
        <FootnoteRef number={186} />
        a pesar de que el Mesías ya había venido en la carne y los había abrogado; pues,
        es muy difícil desprender a las personas de aquellas cosas en las que han sido
        criadas y educadas, y a las cuales sus mentes están fuertemente aferradas. De
        hecho, algunos de estos seguidores de Cristo hubieran hecho que los creyentes
        gentiles se sometieran al mismo yugo de la circuncisión, a lo cual se opuso Pablo,
        viendo más allá de todas esas cosas y sabiendo que el reino de Dios no era comida
        ni bebida, sino justicia, paz y gozo en el Espíritu Santo.
        <FootnoteRef number={187} />
        En verdad, Pablo enseñó abiertamente que el reino de Dios no consistía en
        palabras, sino en poder,
        <FootnoteRef number={188} />
        ni en diversos lavamientos y ordenanzas carnales que eran sombras, destinadas a
        perecer, sino que la sustancia era Cristo, y los que están Él, están completos en
        Él, declarando que si después volvieran al pacto de la circuncisión, para nada les
        aprovecharía Cristo.
        <FootnoteRef number={189} />
        Y, sin embargo, encontramos que, tal era su consideración hacia estos nuevos
        creyentes, que a pesar de todo, circuncidó a Timoteo, y que cuando estuvo en
        Jerusalén, se rasuró su cabeza, etc.,
        <FootnoteRef number={190} />
        comportándose como un judío por el bien de los que no veían tan lejos como él.
        <FootnoteRef number={191} />
      </MdxP>
      <MdxP>
        Y no obstante que fue un predicador tan esforzado y celoso del evangelio, vemos
        que bautizó muy pocos con agua, e incluso dio gracias a Dios de no haber bautizado
        a ninguno más,
        <FootnoteRef number={192} />
        (poniendo de manifiesto que el bautismo en agua no era en aquel entonces parte
        esencial del evangelio) y más bien dijo claramente que no había sido enviado a
        bautizar, sino a predicar el evangelio,
        <FootnoteRef number={193} />
        a convertir a las personas de la tinieblas a la luz y de la potestad de Satanás a
        Dios, quien los había librado de la potestad de las tinieblas y los había
        trasladado al reino de Su amado Hijo.
        <FootnoteRef number={194} />
        {` `}
        <em>Esto</em> es lo que es absolutamente necesario para nuestra salvación. Pablo
        no bautizaba simplemente porque otros lo estaban haciendo (que en realidad es la
        única comisión que cualquiera pueda pretender hoy en día.) Y es por esta razón que
        a veces decimos del bautismo lo que Pablo dijo acerca de la circuncisión: “Porque
        en Cristo Jesús, ni el bautismo, ni la falta de bautismo valen nada, sino una
        nueva creación.” Porque ser hecho una nueva criatura es la señal más verdadera de
        poseer la gracia interna y espiritual, y de estar en Cristo, y está por encima de
        todas las señales externas.
      </MdxP>
      <MdxP>
        Habiendo los apóstoles concedido lugar a esta práctica por un tiempo, no es de
        extrañar que el bautismo en agua continuara en los siglos siguientes y que poco
        después ganara terreno en la apostasía que surgió. Porque a medida que la
        corrupción entraba en la iglesia y se aumentaba, el Espíritu y la vida del
        cristianismo eran cada vez más eclipsados, y las mentes de sus profesantes se
        volvían más oscuras, y entonces se aferraban cada vez más a prácticas externas. Y
        estos no solo continuaron con aquellas prácticas que habían sido usadas por sus
        predecesores, o al menos algo similar en su lugar, sino que, poco a poco,
        añadieron más ritos y ceremonias, y finalmente, comenzaron a embellecer y adornar
        esa religión que inicialmente era sencilla, simple y humilde, y{` `}
        <em>consistía más en poder y amor divino que en observaciones externas.</em> Y
        esta, con el paso del tiempo, fue tan adornada y engalanada, que su esplendor
        distinguido se volvió atractivo para otros. Bajo esta degeneración surgió la
        práctica del bautismo infantil, que es una invención completamente humana, sin
        ninguna autoridad en las Escrituras ni por precepto ni por práctica; aunque
        quienes lo practican a menudo nos reprochan por negarlo.
      </MdxP>
      <MdxH3 id="pan-y-vino">Pan y Vino</MdxH3>
      <MdxP>
        Pero lo que causa la queja más fuerte en nuestra contra, es que no practicamos el
        sacramento (así llamado) del pan y vino. Este es ese “error pestilente y mortal”
        que, en la opinión de nuestros opositores, nos hace “peor que los papistas.” Pero
        deseamos que nuestros vecinos sobrios consideren si tales palabras nos han sido
        atribuidas justamente—no juzgando por rumores, ni por una fe implícita en lo que
        otros dicen de nosotros.
      </MdxP>
      <MdxP>
        No somos ignorantes del gran alboroto y agitación que se ha levantado acerca de
        este asunto en la cristiandad, para escándalo del cristianismo tanto entre judíos
        como entre turcos. Los papistas han convertido este rito en completa idolatría,
        afirmando que es el verdadero cuerpo y sangre del Hijo de Dios, y como tal lo
        adoran. Otros dicen que Cristo está en ello, aunque no sepan cómo; unos dicen que
        es esto, otros dicen que es aquello; mientras que todos parecen esperar recibir
        algo de ello que no necesariamente administra; y todo por no entender la
        diferencia entre el verdadero pan de vida que desciende del cielo (esa carne y
        sangre de Cristo que da vida a todos los que se alimentan de ella, por medio de la
        cual moran en Él y Él en ellos,
        <FootnoteRef number={195} />) y esa cena que fue comida por los cristianos
        primitivos en conmemoración de Su muerte y sacrificio; las cuales no están tan
        unidas como para que la una incluya necesariamente a la otra, como la experiencia
        testifica de forma abundante, si las personas fueran honestas consigo mismas en
        esto. ¿Cuántos hay que reciben el pan externo año tras año, y sin embargo se
        quejan toda la vida de muerte, sequedad y debilidad en sus almas, y de falta de
        poder, sin recibir esa renovación de vida y fuerza espiritual que se supone que
        hay en ello? Porque ¿cómo pueden esperar alimentarse espiritualmente de Cristo en
        sus corazones si no están dispuestos a reconocer que Él realmente mora en Sus
        santos,
        <FootnoteRef number={196} />
        sino que lo consideran un error en los que sí lo reconocen?
      </MdxP>
      <MdxP>
        Nosotros, sin embargo, creemos que todas las personas deben estar plenamente
        convencidas en sus propias mentes, y considerar seriamente estas y otras prácticas
        religiosas, sin adoptar cosas meramente por tradición porque otros las hacen.
        Tampoco deben ser presionadas con tanta vehemencia a favor o en contra de cosas
        que no son absolutamente esenciales para la salvación, sobre las cuales sus
        entendimientos todavía no están claros. Ni deben ser escarnecidos o reprochados
        por aquellas cosas que, para ellos, son cuestión de consciencia, y por lo tanto,
        sagradas, aunque para otros parezcan de menor importancia. En verdad, esta
        práctica es una gran vergüenza entre las personas que profesan el cristianismo.
        Tampoco juzgamos ni condenamos a aquellos que se encuentran en la práctica de este
        o del bautismo con agua tal como se usaba en la iglesia primitiva, cuyas vidas
        sobrias, cristianas y cuidadosas dan testimonio de sus intenciones sinceras en
        este respecto, y que pueden tener conciencia delicada al respecto, temiendo
        omitirlo hasta estar plenamente persuadidos de lo contrario. Pero en cuanto a
        nosotros, a quienes la esterilidad y vacío de esas señales externas y visibles nos
        son evidentes, no podemos continuar en ello, pues encontramos que la práctica
        externa de estas señales no produce verdadera satisfacción del alma ni nos imparte
        gracia interna y espiritual.
      </MdxP>
      <MdxP>
        Por lo tanto, habiendo gustado que el Señor es bueno y misericordioso, esperamos
        la leche pura de aquella Palabra por la cual hemos sido engendrados para Dios,
        <FootnoteRef number={197} />
        para que podamos recibir fuerza por medio de ella, y crecer en la gracia y en el
        conocimiento de nuestro Señor Jesucristo,
        <FootnoteRef number={198} />
        y llegar a una mayor experiencia de esa verdadera comunión y unidad interna y
        espiritual con Él, en la cual Él cena con Sus santos y ellos con Él,
        <FootnoteRef number={199} />
        y reciben vida de Aquel que mora en ellos y ellos en Él—así como los miembros de
        un cuerpo están unidos a la cabeza, participan de su vida y viven por ella;
        <FootnoteRef number={200} />
        o como los pámpanos están unidos a la Vid,
        <FootnoteRef number={201} />
        los cuales reciben vida, virtud y alimento de ella, y de esa manera llevan fruto
        para la gloria de Dios, lo cual es agradable para Él. No es suficiente que
        participemos de esa cena una vez al mes, o una vez cada tres meses, sino que, como
        los judíos tenían su maná{` `}
        <em>fresco cada mañana,</em>
        <FootnoteRef number={202} />
        debemos recibir suministro diario y una renovación de fuerzas en nuestro hombre
        interno al comer ese pan celestial que nutre para vida eterna, bebiendo
        abundantemente de ese pozo de agua viva que en los santos salta para vida eterna.
        <FootnoteRef number={203} />
        Porque, así como en Dios vivimos, nos movemos y tenemos nuestro ser,
        <FootnoteRef number={204} />
        así Cristo es la verdadera y propia vida del hombre interior, por la cual
        realmente vive para Dios, y no puede vivir sino por Él. Aquellos que han sido
        engendrados para Dios por la Palabra de vida, y nacen de nuevo por el Espíritu,
        tienen el privilegio de alimentarse de Cristo y disfrutarlo, cosa que nadie puede
        hacer si no haya sido primero vivificado y resucitado por Él. En verdad, nadie
        puede recibir la vida, la savia y la virtud de Él como su cabeza y vid que no esté
        primero unido a Él como miembro y pámpano. Ni el simple hecho de rociar un niño
        con agua lo convierte en un miembro vivo de Cristo y le da acceso a alimentarse de
        Él (como ya hemos expresado) aunque comiera el pan y el vino de la iglesia durante
        todos los días de su vida.
      </MdxP>
      <MdxP>
        Y puesto que disfrutamos de la sustancia de esta comida y bebida sin la señal,
        ¿por qué no podemos omitir la parte externa y figurativa como algo temporal o no
        de absoluta necesidad? Y, ¿por qué la misma autoridad que absuelve y excusa a
        otros cristianos de lavarse los pies unos a otros,
        <FootnoteRef number={205} />
        no puede absolvernos a nosotros del uso de este rito, y excusarnos de “quebrantar”
        un mandamiento de Cristo? O, ¿qué hay de la instrucción de los apóstoles de
        apartarse de ahogado y de sangre,
        <FootnoteRef number={206} />
        o de la costumbre mencionada por Santiago de ungir con aceite a los enfermos?
        <FootnoteRef number={207} />
        ¿Por qué habrían de ser parciales nuestros adversarios respecto a lo que los
        cristianos han dejado de usar? ¿No tenemos buenas razones para concluir que si
        estas otras cosas no hubieran sido abandonadas hace tanto tiempo, los cristianos
        hoy habrían permanecido tan aferrados a ellas como lo han estado al bautismo en
        agua? Y, por otro lado, si el pan y el vino se hubieran dejado de usar en aquel
        entonces (cuando se abandonó la unción con aceite y la preocupación por los
        alimentos estrangulados), ¿no se sentirían la mayoría de los cristianos más libres
        de omitirlos hoy? Porque la tradición, la costumbre y la educación dejan una
        impresión mayor en la mente de las personas de lo que quizás somos conscientes; y
        no es tarea fácil, al principio, apartarlas de aquellas cosas a las que se han
        aferrado con tanta firmeza.
      </MdxP>
      <MdxP>
        Puesto que Dios ha llenado nuestros corazones con Su gracia, y no nos ha privado
        de Su maná celestial, sino que diariamente demuestra que está con nosotros por Su
        presencia consoladora para nuestra gran satisfacción, aun cuando omitimos estas
        cosas, supliendo nuestras necesidades cuando acudimos a Él, quien capacita y
        fortalece a aquellos de nosotros que conservamos nuestra sinceridad e integridad
        primitivas con el deseo de llevar una vida sobria, piadosa y cristiana, que adorna
        el evangelio de Cristo y es el fruto cierto de la gracia espiritual. Y dado que
        incluso nuestros adversarios reconocen que estos sacramentos no son más que
        señales visibles y externas, y no se atreven a decir que la gracia interna y
        espiritual esté necesariamente vinculada a ellos, ni que sean de absoluta
        necesidad para la salvación, ¿con qué razón, entonces, preguntamos, nos declaran
        como “no cristianos,” y además nos cargan con calumnias y acusaciones en este
        sentido, usando esto frecuentemente como ejemplo para difamarnos y condenar toda
        nuestra profesión cristiana?
      </MdxP>
      <MdxH2 id="conceptos-en-la-cabeza">
        No se trata de Conceptos en la Cabeza, sino un Espíritu que gobierna el Corazón
      </MdxH2>
      <MdxP>
        Porque aunque seguir ciertas formas y ceremonias pueda unir y distinguir a
        sociedades y comuniones particulares, es seguro que ninguna observación o
        práctica, separada de la dirección y gobierno del Espíritu de Cristo como cabeza,
        puede convertirnos en miembros de Él. De hecho, podemos tener una buena apariencia
        externa, y tener un sistema de creencias en nuestras mentes, pero si Cristo no
        gobierna en nuestros corazones, no somos de Él. Ahora bien, si los que profesan el
        cristianismo estuvieran menos preocupados por señales y sombras, y por disputas y
        distinciones superficiales e innecesarias, y se dedicaran más a seguir los
        preceptos más esenciales, importantes e indispensables de Cristo, demostrando el
        poder que Él tiene sobre sus mentes al mostrarse como Sus verdaderos discípulos y
        legítimos herederos de Su reino, estando en cierta medida investidos de Sus
        virtudes y gracias divinas, seguramente tendríamos menos envidia, conflictos,
        chismes y detracciones (que solo debilitan el interés común de la piedad, y le dan
        ventaja a nuestro enemigo común), y en su lugar, tendríamos más amor cristiano,
        paz, armonía y buenas relaciones entre nosotros. Sí; si todos los que desean hacer
        el bien simplemente se dedicaran a perseguir la virtud, a amarla y promoverla
        dondequiera que la encuentre, y a aborrecer el vicio y el mal en todos,
        rechazándolo en todo lugar, e hicieran de esto la verdadera expresión de su amor
        cristiano (en lugar de discutir sobre opiniones en asuntos menores), nos
        acercaríamos más unos a otros y avanzaríamos mucho más en la verdadera piedad que
        con todas las disputas sobre diferentes interpretaciones en asuntos mucho menos
        esenciales.
      </MdxP>
      <MdxP>
        Dios, que no mira los nombres sino las naturalezas, conoce entre todas las
        naciones y pueblos a los que son Suyos; y la regla que nos dejó para reconocerlos
        es por sus frutos, pues las acciones son la manifestación de sus voluntades. Toda
        la humanidad está bajo el poder y la guía del Espíritu de Dios, o bajo el del
        diablo; tienen una mente carnal o una mente espiritual, y cualquiera que sea la
        fuente y la inclinación de sus deseos y afectos, así serán sus acciones—pues, cada
        nacimiento tiene sus frutos propios, que son contrarios entre sí. Por lo tanto,
        independientemente de los conceptos u opiniones que predominen en las mentes, los
        hombres viven conforme al espíritu y la naturaleza que gobierna sus corazones. No
        podemos recoger uvas de los espinos, ni higos de los abrojos; ninguna fuente emite
        agua amarga y dulce al mismo tiempo. Es una verdad evangélica que aquellos que
        viven en envidia y contienda, y producen los frutos de la carne,
        <FootnoteRef number={208} />
        son de su padre el diablo; y aquellos que, por el Espíritu, hacen morir esos
        deseos y afectos corruptos, y producen los frutos del Espíritu,
        <FootnoteRef number={209} />
        adornando la doctrina de Dios nuestro Salvador con una vida sobria, justa y
        piadosa, éstos son de Dios—porque es en esto que se diferencian los hijos de Dios
        de los hijos del diablo.
        <FootnoteRef number={210} />
      </MdxP>
      <MdxP>
        Así hemos expresado, con franqueza aunque brevemente, nuestra verdadera opinión y
        creencia respecto a aquellos puntos en los cuales creemos que nuestros adversarios
        han intentado condenarnos, lo cual esperamos sea satisfactorio para quienes aún no
        se han decidido a pensar mal de nosotros. En verdad, no tenemos otro interés que
        promover el avance de la verdadera piedad y del cristianismo; sintiendo amor y
        buena voluntad hacia todas las personas, y especialmente hacia aquellos cuyos
        corazones han sido despertados y tocados, quienes tienen verdaderos y fervientes
        ruegos y anhelos vivos hacia Dios, sedientos de un conocimiento de Él y de una
        comunión con Él que vayan mucho más allá de una mera profesión externa o de un
        conocimiento de oídas. Por lo tanto, lo que hemos encontrado como provechoso, útil
        y satisfactorio en nuestra incasable búsqueda de la paz con Él, <em>eso</em> es lo
        que recomendamos a los demás.{` `}
        <em>Llamamos a las personas a volverse al don de Dios en sí mismas,</em>
        {` `} que es lo único que puede hacerles bien, para que cada uno conozca por sí
        mismo al buen Pastor y Obispo de las almas, y escuche y reconozca Su voz en ellos,
        diferenciándola de la de un extraño, y así aprender de Él y seguirlo, quien es
        puro y siempre conduce a la pureza y la santidad, para que así la ofrenda que hizo
        de Sí mismo por ellos les sea provechosa y puedan experimentar la gran salvación
        de Dios.
      </MdxP>
      <MdxH2 id="proposito-de-su-venida">El Propósito de Su Venida</MdxH2>
      <MdxP>
        Escriban esto en sus mentes y llévenlo con ustedes: que, aunque nuestro Salvador
        realmente pagó el rescate por nosotros e hizo una propiciación por medio de la
        sangre preciosa de Su cruz, sin embargo, si no experimentamos el propósito de Su
        venida, y esa muerte realizada y cumplida en nosotros mismos, para nada nos
        aprovechará. A menos que lo experimentemos a Él como un Salvador y Ayudador
        cercano; a menos que experimentemos una semilla de Luz y vida divinas que ilumine
        nuestras mentes, reviva y caliente nuestros corazones decaídos, engendre e
        incremente el verdadero amor a Dios y esa fe viva que da victoria, gobierna
        nuestros pensamientos, renueva y regula nuestras voluntades, limita nuestros
        deseos, frena nuestras lenguas, estimula inclinaciones santas, y mantiene una
        ardiente devoción en nuestro cristianismo, fortaleciendo nuestras mentes en lo que
        es bueno y agradable a Dios; digo, a menos que experimentemos estas cosas en y por
        nosotros mismos, toda nuestra apariencia exterior de religión será en vano, y
        nuestra profesión de Cristo no nos aprovechará en nada, sino que al final seremos
        sepultados en dolor. Porque solo son de Cristo aquellos que tienen Su Espíritu y
        están gobernados por Él. Los hijos de Dios son solo aquellos que son guiados por
        el Espíritu de Dios;
        <FootnoteRef number={211} />
        el cual engendra en la mente un aborrecimiento de todo pecado y maldad, y un amor
        por la pureza, la bondad y la virtud.
      </MdxP>
      <MdxH2 id="juicio-venidero">El Juicio Venidero</MdxH2>
      <MdxP>
        Por lo tanto, desechando toda contienda y hostilidad, toda envidia y maledicencia,
        aborrezcamos lo malo y sigamos lo bueno,
        <FootnoteRef number={212} />y dediquémonos con la debida y humilde atención al
        cumplimiento del asunto más importante de nuestra vida: “ocuparnos en nuestra
        salvación con temor y con temblor.” Que cada uno siga fielmente al Señor, conforme
        a lo que se le haya dado a conocer, sabiendo que seremos juzgados de acuerdo con
        lo que hemos conocido, y que será bienaventurado aquel cuya voluntad y acciones
        correspondan con su entendimiento en aquel día en que todos deberán comparecer
        ante el tribunal de Cristo y dar cuenta de sus obras hechas en el cuerpo, y
        recibir la sentencia de, “Venid benditos,” o “Apartaos de mí hacedores de
        iniquidad.”
      </MdxP>
      <MdxP>
        En ese momento, no tendrá importancia a qué congregación o confesión de fe se
        pertenecía, ni qué persuasión se tenía entre las muchas que existen; porque entre
        todas ellas solo habrá dos clases: las ovejas y las cabras; es decir, aquellos que
        escucharon la voz del Pastor y lo siguieron, quienes fueron guiados y gobernados
        por el buen Espíritu de Dios en sus corazones; y aquellos que, envolviendo su
        talento en un pañuelo, sofocaron sus convicciones y, menospreciando el día de su
        visitación, continuaron bajo el oscuro poder del maligno. Un hombre puede avanzar
        mucho, mostrar una gran apariencia de religión y piedad, y aun así ser apartado a
        la izquierda al final. No se trata de llenar nuestras cabezas de conceptos
        curiosos o sublimes, con especulaciones refinadas y elevadas. De hecho, por muy
        bien que adornemos y decoremos nuestras lámparas, esto no bastará para otorgarnos
        a una entrada sin el aceite celestial, es decir, sin esa unción divina y santa que
        llena nuestros corazones, ilumina nuestras mentes y enciende nuestros afectos
        hacia la vigilancia y la obediencia a Sus enseñanzas, las cuales son las marcas
        más seguras de que realmente estamos en Cristo, en quien únicamente encontramos
        nuestra aceptación.
      </MdxP>
      <MdxP>
        Es nuestro sincero deseo que ustedes con nosotros, y nosotros con ustedes, vivamos
        tan cuidadosamente conforme a la luz y al conocimiento que Cristo nos ha dado, que
        nuestras conciencias no nos condenen; y que así, habiendo terminado nuestros días
        aquí con tranquilidad, podamos recostar nuestras cabezas en paz, con una esperanza
        firme de una resurrección gozosa, teniendo confianza en el día del juicio.
      </MdxP>
      <MdxH3>Notas al pie de página:</MdxH3>
      <Footnotes />
    </div>
  </div>
);

export default Page;

export async function generateMetadata(): Promise<Metadata> {
  if (LANG === `en`) {
    notFound();
  } else {
    return seo.nextMetadata(
      `Creencias de los Primeros Cuáqueros`,
      seo.QUAKER_BELIEFS_SEO_META_DESC_ES,
    );
  }
}

export const dynamic = `force-static`;
