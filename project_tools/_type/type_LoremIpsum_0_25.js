/**
 *	Lorem Ipsum 0.2.5
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *	A Lorem Ipsum/Greeking/Dummy-Text generator for Illustrator
 *	instead of having to use InDesign or sites like lipsum.com
 *
 *	http://blog.kennethfrederick.de/2011/06/scriptographer-lorem-ipsum.html
 *
 *	lists used for different styles inspired or stolen from
 *	http://bavaria-ipsum.de/ (stolen)
 *	http://veggieipsum.com/ (inspired)
 *	http://baconipsum.com/ (stolen)
 *	http://hipsteripsum.me/ (stolen)
 *
 *	except for finnish, that was created for
 *	Mikko Nirhamo
 *	https://twitter.com/nirri
 *
 *	mock philosophy generator
 *	based on the work done in python by Mark Pilgrim
 *
 *	Mark Pilgrim
 *	mark@diveintopython.org
 *	
 *	Revision: 1.4
 *	2004/05/05 21:57:19
 *	Copyright (c) 2001 Mark Pilgrim"
 *
 *	the actual kgp.py included with this example was taken
 *	from the nodebox source code https://github.com/nodebox/nodebox-pyobjc.git
 *
 *	I've implemented an odd work around to get the text
 *	by using java to execute a python runtime
 *	(because I couldn't port the original python to javascript)
 *
 */




// ------------------------------------------------------------------------
// Libraries
// ------------------------------------------------------------------------
importPackage(java.net); 
importPackage(java.io);



// ------------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------------
/**
 *	Note from the Scriptographer.org Team
 *
 *	In Scriptographer 2.9, we switched to a top-down coordinate system and
 *	degrees for angle units as an easier alternative to radians.
 *
 *	For backward compatibility we offer the possibility to still use the old
 *	bottom-up coordinate system and radians for angle units, by setting the two
 *	values bellow. Read more about this transition on our website:
 *	http://scriptographer.org/news/version-2.9.064-arrived/
 */

script.coordinateSystem = 'bottom-up';
script.angleUnits = 'radians';


// ------------------------------------------------------------------------
// document properties
// ------------------------------------------------------------------------
var sel;
var palette;

var bVerbose = false;

/**
 *	word sets
 */
var lorem = new Array('lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipisicing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum');
var ipsumdolor = ' ipsum dolor sit amet ';

var suomi = new Array( 'arvokisa', 'puhuttaa', 'l'+String.fromCharCode(228)+'hialue', 'kuin mit'+String.fromCharCode(228), 'valtiovalta', 'toimivuus', 'korkeatasoinen', 'yhteis'+String.fromCharCode(246)+'vero', 'selvill'+String.fromCharCode(228), 'ilman ett'+String.fromCharCode(228), 'keskusj'+String.fromCharCode(228)+'rjest'+String.fromCharCode(246), 'yhteistoiminta', 'neuvottelukunta', 'alaisuus', 'ty'+String.fromCharCode(246)+'reformi', 'siin'+String.fromCharCode(228)+' miss'+String.fromCharCode(228), 'toimintatapa', 'sen enemp'+String.fromCharCode(228)+String.fromCharCode(228), 'tilastokeskus', 'peruspalvelu', 'varatoimitusjohtaja', 'kuvataiteilija', 'osastop'+String.fromCharCode(228)+String.fromCharCode(228)+'llikk'+String.fromCharCode(246), 'vasta', 'sitten', 't'+String.fromCharCode(228)+'h'+String.fromCharCode(228)+'nastinen', 'siin'+String.fromCharCode(228)+' mieless'+String.fromCharCode(228), 'ylijohtaja', 'kauppahinta', 'v'+String.fromCharCode(228)+String.fromCharCode(228)+'nt'+String.fromCharCode(246), 'hallitusneuvottelu', 'pelinjohtaja', 'ltk', 'persoonallinen', 'taloyhti'+String.fromCharCode(246), 'suoranainen', 'puoluehallitus', 's'+String.fromCharCode(228)+String.fromCharCode(228)+'d'+String.fromCharCode(246)+'s', 'tutkimustulos', 'rahoituser'+String.fromCharCode(228), 'kouluttaja', 'viime k'+String.fromCharCode(228)+'dess'+String.fromCharCode(228), 'j'+String.fromCharCode(228)+'tt'+String.fromCharCode(228)+'minen', 'sen', 'paremmin', 'puhuminen', 'n'+String.fromCharCode(228)+'kyviss'+String.fromCharCode(228), 'kantelu', 'toimilupa', 'tapainen', 'mets'+String.fromCharCode(228)+'yhti'+String.fromCharCode(246), 'energiayhti'+String.fromCharCode(246), 'kehitt'+String.fromCharCode(228)+'mishanke', 'yhteisty'+String.fromCharCode(246)+'sopimus', 'terveystoimi', 'elinkeinokeskus', 'yll'+String.fromCharCode(228)+'pit'+String.fromCharCode(228)+'minen', 'kunnostaminen', 'pikamatka' );

var bairisch = new Array( 'a', 'a bissal', 'a bissal wos gehd ollaweil', 'a bravs', 'a fescha Bua', 'a ganze', 'a ganze Hoiwe', 'a geh', 'a Hoiwe', 'a liabs Deandl', 'a Ma'+String.fromCharCode(223)+' und no a Ma'+String.fromCharCode(223)+'', 'a Prosit der Gmiadlichkeit', 'a so a Schmarn', 'aasgem', 'aba', 'abfieseln', 'allerweil', 'Almrausch', 'am acht’n Tag schuf Gott des Bia', 'amoi', 'an', 'anbandeln', 'auf der Oim, da gibt’s koa S'+String.fromCharCode(252)+'nd', 'auf’d Schellnsau', 'auffi', 'Auffisteign', 'auszutzeln', 'Baamwach', 'back mas', 'baddscher', 'barfua'+String.fromCharCode(223)+'at', 'Biagadn', 'Biakriagal', 'Biawambn', 'Biazelt', 'bitt', 'Bladl', 'bl'+String.fromCharCode(228)+'rrd', 'Blosmusi', 'boarischer', 'Bradwurschtsemmal', 'Breihaus', 'Brezn', 'Broadwurschtbudn', 'Brodzeid', 'Brotzeit', 'Buam', 'Bussal', 'Charivari', 'd’', 'da', 'da Kini', 'da, hog di hi ', 'dahoam', 'damischa', 'de', 'de Sonn', 'Deandlgwand', 'ded', 'dei', 'des', 'des basd scho', 'des is hoid aso', 'des is schee', 'des muas ma hoid kenna', 'des wiad a Mordsgaudi', 'di', 'Diandldrahn', 'do', 'dringma aweng', 'du dadst ma scho daugn', 'eam', 'eana', 'ebba', 'Edlweiss', 'Engelgwand', 'Enzian', 'es', 'etza', 'fei', 'fensdaln', 'fias', 'Fingahaggln', 'Freibia', 'Gams', 'Gamsbart', 'gar nia need', 'Gaudi', 'geh', 'gelbe R'+String.fromCharCode(252)+'am', 'gfreit mi', 'Gidarn', 'glacht', 'glei', 'Goa'+String.fromCharCode(223)+'ma'+String.fromCharCode(223)+'', 'Graudwiggal', 'grea'+String.fromCharCode(223)+'t eich nachad', 'Greichats', 'griasd eich midnand', 'Griasnoggalsubbm', 'gria'+String.fromCharCode(223)+' God beinand', 'gro'+String.fromCharCode(223)+'herzig', 'gscheckate', 'gscheid', 'gscheit', 'Gschicht', 'gschmeidig', 'Gstanzl', 'guad', 'Guglhupf', 'gwihss', 'gwiss', 'Habedehre', 'Haberertanz', 'Haferl', 'hallelujah sog i, luja', 'ham', 'hawadere midananda', 'hea', 'heid', 'heid gfoids ma sagrisch guad ', 'Heimatland', 'heitzdog', 'helfgod', 'Hemad', 'Hendl', 'Hetschapfah', 'hi', 'hoam', 'hob', 'hob i an Suri', 'hod', 'hogg di hera', 'hoggd', 'hoid', 'i', 'i bin a woschechta Bayer', 'i daad', 'i hob di narrisch gean', 'i mechad dee Schwoanshaxn', 'i moan scho aa', 'i mog di fei', 'i waar soweid', 'iabaroi', 'imma', 'in da', 'in da greana Au', 'is', 'is des liab', 'is ma Wuascht', 'ja, wo samma denn', 'jedza', 'jo mei', 'jo mei is des schee', 'Jodler', 'Kaiwe', 'kimmt', 'Kirwa', 'Klampfn', 'kloan', 'Kneedl', 'koa', 'Kuaschwanz', 'kumm geh', 'kummd', 'Landla', 'Ledahosn', 'lem und lem lossn', 'Leonhardifahrt', 'Lewakaas', 'liberalitas Bavariae', 'ma', 'Maderln', 'Maibam', 'Mamalad', 'Marei', 'Marterl', 'Ma'+String.fromCharCode(223)+'kruag', 'measi', 'mechad', 'mehra', 'mei', 'Meidromml', 'mi', 'midanand', 'middn', 'Milli', 'mim', 'mim Radl foahn', 'moand', 'mogsd a Bussal', 'Mongdratzal', 'muass', 'Musi', 'naa', 'nackata', 'Namidog', 'ned', 'ned woar', 'nia need', 'nimma', 'nimmds', 'nix', 'no', 'no a Ma'+String.fromCharCode(223)+'', 'oa', 'Oachkatzlschwoaf', 'oamoi', 'oans', 'oans, zwoa, gsuffa', 'oba', 'obandeln', 'obandln', 'Obazda', 'ognudelt', 'ois', 'om auf’n Gipfe', 'owe', 'ozapfa', 'pfiad de', 'pfundig', 'Prosd', 'Radi', 'Radler', 'Reiwadatschi', 'resch', 'Resi', 'samma', 'sammawiedaguad', 'san', 'Sauakraud', 'sauba', 'Sauwedda', 'schaugn', 'Schbozal', 'Schdarmbeaga See', 'Schdeckalfisch', 'scheans', 'Schmankal', 'Schneid', 'schoo', 'Schuabladdla', 'sch'+String.fromCharCode(252)+'ds nei', 'sei', 'Semmlkneedl', 'Sepp', 'Servas', 'singan', 'singd', 'so', 'so schee', 'sodala', 'sog i', 'soi', 'sowos', 'Spezi', 'Spuiratz', 'Steckerleis', 'Stubn', 'Trachtnhuat', 'trih'+String.fromCharCode(246)+'leridi dijidiholleri', 'um Godds wujn', 'umananda', 'umma', 'unbandig', 'und', 'und glei wirds no fui lustiga', 'und sei', 'vasteh', 'Vergeltsgott', 'vo de', 'von', 'vui', 'wann griagd ma nacha wos z’dringa', 'Watschnbaam', 'Watschnpladdla', 'wea ko, dea ko', 'Weibaleid', 'weida', 'Wei'+String.fromCharCode(223)+'wiaschd', 'Weiznglasl', 'wia', 'wiavui', 'Wiesn', 'wo hi', 'woa'+String.fromCharCode(223)+'', 'Woibbadinga', 'wolln', 'wolpern', 'wos', 'wui', 'wuid', 'Wurscht', 'Wurschtsolod', 'Zidern', 'zua', 'z'+String.fromCharCode(252)+'nftig', 'Zwedschgndadschi', 'zwoa', 'Aff', 'Affnasch', 'Apruiaff', 'Asphaltwanzn', 'aufgschdeida Mausdreg', 'Aufm'+String.fromCharCode(252)+'pfiga', 'Aufschneida', 'Auftaklta', 'Auftreiwa', 'Aushuifsbaya', 'Badhur', 'Badwaschl', 'Bagaasch', 'Bauantrampl', 'Bauernf'+String.fromCharCode(252)+'nfa', 'Bauernsch'+String.fromCharCode(228)+'dl', 'Bazi', 'Bei'+String.fromCharCode(223)+'n', 'Bei'+String.fromCharCode(223)+'zanga', 'Beitlschneida', 'Besnbinda', 'Betonschedl', 'Betschwesta', 'Bettbrunza', 'Bettwanzn', 'Biaschdal', 'Bierdimpfl', 'Blasengl', 'Bodschal', 'Bridschn', 'Broatarsch', 'Bruinschlanga', 'bsuffas Wagscheidl', 'Chaotngschwerl', 'Charaktasau', 'Daamaluudscha', 'damischa Depp', 'damischa Sauprei'+String.fromCharCode(223)+'', 'depperta Doafdebb', 'Dickschedl', 'Dipfalschei'+String.fromCharCode(223)+'a', 'Doafdrottl', 'Doafmatratzn', 'dreckata Drek', 'Dreeghamml', 'Dreegsau', 'Dreegschleida', 'Drottl', 'du ogsoachte', 'du saudamischa', 'Duitaff', 'Ecknsteha', 'Eignbr'+String.fromCharCode(246)+'dla', 'eigschnabbda', 'Eisackla', 'elendiger', 'Erzdepp', 'fade Noggn', 'Fechtbruada', 'Fegeisen', 'Fettl', 'Fieschkoobf', 'Finessenseppal', 'Flaschn', 'Flegel', 'Fliedschal', 'Freibial'+String.fromCharCode(228)+'dschn', 'Freindal', 'Frichdal', 'Geizgroogn', 'Gibskobf', 'Gifthafal', 'Giftschbridzn', 'Gigal', 'glei foid da Wadschnbam um', 'Gmoadepp', 'Goaspeterl', 'Goggolore', 'Grantla', 'Grantlhuaba', 'Grattla', 'Grawurgl', 'grei'+String.fromCharCode(223)+'licha Uhu', 'Griasgram', 'Grischbal', 'Gro'+String.fromCharCode(223)+'kopfada', 'Gschaftlhuaba', 'gscheada Saubrei'+String.fromCharCode(223)+'', 'Gscheidal', 'Gscheidhaferl', 'gscherta Hamml', 'gscherte Nuss', 'gwampate Sau', 'Hallodri', 'Haumdaucha', 'Hausdracha', 'Heislmo', 'Heislschlaicha', 'Hemmadbiesla', 'Herrgoddsacklzementfixlujja', 'Himmeheagodna', 'Himmi Herrgott Saggrament', 'hindafozziga', 'Hinderducker', 'Hockableiba', 'Hodalumb', 'Hoibschaariga', 'hoid dei Babbn', 'hoit dei damische Goschn', 'hoit’s Mei', 'Honigschei'+String.fromCharCode(223)+'a', 'Hopfastanga', 'Hornochs', 'Hosnscheissa', 'hosd mi', 'Hubbfa', 'Hundsbua', 'Hundsgribbe', 'Hungaleida', 'i glaub, dir brennt da Huat', 'Jochgeia', 'junga Duttara', 'junga Hubbfa', 'Jungfa', 'Kaasloabe', 'Kamejtreiba', 'Karfreidogsratschn', 'Kasberl', 'Katzlmacha', 'Kirchalicht', 'Kircharutschn', 'Kittlschliaffa', 'Klaubauf', 'klebrigs Biaschal', 'Klob'+String.fromCharCode(252)+'rschdn', 'Klugscheissa', 'Knedlfressa', 'Kniabisla', 'Krampfhenna', 'Kreizdeifi', 'Krippnmandl', 'kropfata Hamml', 'krummhaxata Goa'+String.fromCharCode(223)+'bog', 'L'+String.fromCharCode(228)+'tschnbebbi', 'Lausbua', 'misdiga Lausbua', 'Mistviach', 'mit deinen Badwandlf'+String.fromCharCode(252)+'a'+String.fromCharCode(223)+'', 'mogsd a Wadschn', 'Nasnboara', 'Neidhamml', 'Oasch', 'Oaschgsicht', 'oida Daddara', 'oida Daggl', 'oida Schlawina', 'oide Bixn', 'oide Rudschn', 'oide Sch'+String.fromCharCode(228)+'sn', 'oide Sch'+String.fromCharCode(228)+'wan', 'Palmesel', 'Pfennigfuxa', 'Pfingsdochs', 'Pfundhamme', 'Pfundsau', 'Pimpanell', 'Plotschn', 'Presssack', 'Pritschn', 'Rabenviech', 'Radlfahra', 'Ratschkathl', 'Rotzgloggn', 'Rua'+String.fromCharCode(223)+'nosn', 'Rutschn', 'Sagglzemend', 'Saggrament', 'Sau', 'Saubrei'+String.fromCharCode(223)+'', 'Saufbeitl', 'Sautreiba', 'Schachtlhuba', 'Schbinodwachdl', 'Schbringgingal', 'Schbruchbeidl', 'schdaubiga Bruada', 'Schdehlratz', 'Schdinkadores', 'schiache Goa'+String.fromCharCode(223)+'', 'Schlawina', 'schleich di', 'Schleimschei'+String.fromCharCode(223)+'a', 'Schnoin', 'Schoaswiesn', 'Schrumsl', 'Schuasda', 'Schuggsn', 'Schuibuamtratza', 'Schundnickl', 'Schwammal', 'Schwinds'+String.fromCharCode(252)+'chtl', 'Schwobndeifi', 'Schwobns'+String.fromCharCode(228)+'ckle', 'Spinotfressa', 'Stodara', 'Umstandskrama', 'varreckta Deifi', 'varreckter Hund', 'Vieh mit Haxn', 'Voglscheicha', 'Voiksdepp', 'Wuidsau', 'Wurznsepp', 'Zeeefix', 'Zuagroasta', 'Zuchtl', 'Zwedschgarl', 'Zwedschgndatschi', 'Zwedschgnmanndl', 'Zwidawurzn', 'accumsan', 'accusam', 'ad', 'adipiscing', 'adipisici', 'aliqua', 'aliquam', 'aliquip', 'aliquyam', 'amet', 'anim', 'assum', 'at', 'augue', 'aute', 'autem', 'blandit', 'cillum', 'clita', 'commodi', 'commodo', 'congue', 'consectetuer', 'consectetur', 'consequat', 'consetetur', 'culpa', 'cum', 'cupiditat', 'delenit', 'deserunt', 'diam', 'dignissim', 'dolor', 'dolore', 'dolores', 'doming', 'duis', 'duo', 'ea', 'eirmod', 'eiusmod', 'eleifend', 'elit', 'elitr', 'enim', 'eos', 'erat', 'eros', 'esse', 'est', 'et', 'eu', 'euismod', 'eum', 'ex', 'Excepteur', 'exerci', 'exercitation', 'facer', 'facilisi', 'facilisis', 'feugait', 'feugiat', 'fugiat', 'gubergren', 'hendrerit', 'id', 'illum', 'imperdiet', 'in', 'incidunt', 'invidunt', 'ipsum', 'iriure', 'iure', 'iusto', 'justo', 'kasd', 'labore', 'laboris', 'laborum', 'laoreet', 'liber', 'lobortis', 'lorem', 'luptatum', 'magna', 'mazim', 'minim', 'molestie', 'mollit', 'nam', 'nibh', 'nihil', 'nisi', 'nisl', 'nobis', 'non', 'nonummy', 'nonumy', 'nostrud', 'nulla', 'obcaecat', 'odio', 'officia', 'option', 'pariatur', 'placerat', 'possim', 'praesent', 'proident', 'qui', 'quis', 'quod', 'rebum', 'reprehenderit', 'sadipscing', 'sanctus', 'sea', 'sed', 'sint', 'sit', 'soluta', 'stet', 'sunt', 'suscipit', 'takimata', 'tation', 'te', 'tempor', 'tincidunt', 'ullamco', 'ullamcorper', 'ut', 'vel', 'velit', 'veniam', 'vero', 'voluptate', 'voluptua', 'volutpat', 'vulputate', 'wisi', 'zzril' );

var veggie = new Array( 'alfalfa sprouts', 'asparagus', 'beet greens', 'beets', 'broccoli', 'brussels sprouts', 'cabbage', 'baby carrots', 'carrots', 'cauliflower', 'celery', 'chard', 'chicory', 'bokchoi', 'cilantro', 'collards', 'corn', 'cucumber', 'dill', 'belgian endive', 'witloof chicory', 'endive', 'green beans', 'kale', 'kohlrabi', 'lettuce', 'okra', 'parsley', 'parsnips', 'green peppers', 'red peppers', 'pumpkin', 'purslane', 'rutabaga', 'mustard spinach', 'spinach', 'squash', 'sweet potato', 'tomato', 'turnip', 'watercress', 'apple', 'apricot', 'avocado', 'banana', 'breadfruit', 'bilberry', 'blackberry', 'blackcurrant', 'blueberry', 'currant', 'cherry', 'cherimoya', 'clementine', 'date', 'damson', 'dragonfruit', 'durian', 'eggplant', 'elderberry', 'feijoa', 'gooseberry', 'grape', 'grapefruit', 'guava', 'huckleberry', 'jackfruit', 'jambul', 'kiwi fruit', 'kumquat', 'legume', 'lemon', 'lime', 'lychee', 'mandarine', 'mango', 'melon', 'cantaloupe', 'honeydew melon', 'watermelon', 'rock melon', 'nectarine', 'orange', 'peach', 'pear', 'williams pear or bartlett pear', 'pitaya', 'physalis', 'plum', 'prune', 'pineapple', 'pomegranate', 'pomelo', 'purple mangosteen', 'raisin', 'raspberry', 'western raspberry (blackcap)', 'rambutan', 'redcurrant', 'salal berry', 'satsuma', 'star fruit', 'strawberry', 'tangerine', 'tomato', 'ugli fruit', 'watermelon', 'ziziphus mauritiana' );
var bacon = new Array( 'beef', 'chicken', 'pork', 'bacon', 'chuck', 'short loin', 'sirloin', 'shank', 'flank', 'sausage', 'pork belly', 'shoulder', 'cow', 'pig', 'ground round', 'hamburger', 'meatball', 'tenderloin', 'strip steak', 't-bone', 'ribeye', 'shankle', 'tongue', 'tail', 'pork chop', 'pastrami', 'corned beef', 'jerky', 'ham', 'fatback', 'ham hock', 'pancetta', 'pork loin', 'short ribs', 'spare ribs', 'beef ribs', 'drumstick', 'tri-tip', 'ball tip', 'venison', 'turkey', 'biltong', 'rump', 'jowl', 'salami', 'bresaola', 'meatloaf', 'brisket', 'boudin', 'andouille', 'capicola', 'swine', 'kielbasa', 'frankfurter', 'prosciutto', 'filet mignon', 'leberkas', 'turducken' );
var hipster = new Array( 'hella', '8-bit', 'artisan', 'bahn mi', 'before they sold out', 'bicycle', 'biodiesel', 'brunch', 'craft beer', 'cred', 'farm-to-table', 'fixie', 'food truck', 'hoodie', 'indie', 'keytar', 'mustache', 'organic', 'specs', 'skateboard', 'tofu', 'vegan', 'vinyl', 'viral', 'you probably haven\'t heard of them', 'Austin', 'Brooklyn', 'DIY', 'PBR', 'Portland', 'San Francisco', 'Tom\'s', 'VHS' );

var jive = new Array( 'stash', '\'row', 'honky code', 'slow mofo', 'that slow mofo', 'snatch\'d', 'wetback', 'greaser', 'snatch', 'duzn\'t', 'jibe', 'honkyfool', 'doodad', 'e da damn', 'a da damn', 't da damn', 'd da damn', 'dude', 'mama', 'goat', 'sump\'n', 'honky jibe', 'on rebound', 'check y\'out latah', 'sheeeiit', 'what it is, mama!', 'ya\' know', '\'s coo\', bro.', 'ah be baaad...', 'man!', 'slap mah fro!', 'sho\' nuff', 'sho\' nuff', 'git', 'gots\'ta', 'I\'s gots\'ta be', 'ain\'t', 'is yo\'', 'you is', 'fedora', 'kicker', 'gots\'', 'gots\'ta', 'mosey on down', 'right on! ', 'steal', 'wheels', 'roll', 'feed da bud', 'brother', 'honky', 'gentleman', 'supa\' fine', 'sucka\'', 'wahtahmellun', 'crib', 'dojigger', 'alley', 'clunker', 'o\'', 'wasted', 'superdude', 'super honcho', 'hosed', 'guv\'ment', 'knowed', 'a\'cuz', 'yo\'', 'foe', 'gots', 'yung', 'ya\'', 'you\'s', 'fust', 'honky pigs', 'chittlin\'', 'eyeball', 'scribble', 'in\'', 'some', 'shun', 'mos\'', 'fum', 'cuz\'', 'youse', 'coo\'', 'a\'', 'knode', 'wants\'', 'whup\'', 'likes', 'dun did', 'kind\'a', 'honky chicks', 'dudes', 'dude', 'honky chick', 'wasted', 'baaaad', 'Jimmey', 'Jimmey\'d', 'real', 'puh\'', 'o\'', 'kin', 'plum', 'Motown', 'da\' cave', 'recon\'', 'naptown', 'Buckwheat', 'liva\' lips', 'dat fine soul', 'Amos', 'Leroy', 'dat fine femahnaine ladee', 'raz\'tus', 'fuh\'rina', 'Kingfish', 'Issac', 'Rolo', 'Bojangles', 'snow flake', 'Remus', 'wiz\'', 'dat commie rag', 'bugger\'d', 'funky', 'boogy', 'crib', 'ax\'', 'so\'s', 'haid', 'main man', 'sucka\'s', 'bre\'d', 'begina\'', 'transista\'', 'uh', 'whut', 'duz', 'dig it', 'mah\'', 'ah\'', 'metafuckin\'', 'fro', 'rap', 'beat', 'hoop', 'ball', 'homey', 'farm', 'man', 'wanna', 'be hankerin\' aftah', 'sheeit', 'bigass', 'badass', 'littleass', 'radical', 'be', 'booze', 'scribblin\'', 'issue of gq', 'sheet', 'down', 'waaay down', 'boogie', '\'sup, dude', 'pink cadillac' );

var textStart = '';


/*
 *	husserl.xml
 *	    generates several paragraphs of Husserl
 *	kant.xml
 *	    generates several paragraphs of Kantian philosophy
 *	thanks.xml
 *	    generates a thank you note
 */
var kant    = '/kant/kant.xml';
var husserl = '/kant/husserl.xml';
var thanks  = '/kant/thanks.xml';

var textStyleOptions = CheckForKant();

// values
var values = {
	textAmount:				6,
	textType:				'Words',
	textStyle:				'Lorem ipsum',
	bWithLatin:				true,

	bTitle:					false,
	bPunctuation:			true,
	bStartLorem:			false,

	bReplace:				true,


	/**
	 *	hidden values to control average word occurance
	 *	change here to season to taste
	 */
	paragraphSentenceAvg:	7,
	paragraphLengthRange:	3,
	sentenceLengthAvg:		14,


	// to use this tool as constant palette on screen
	// change this value to 'true' 
	bPalette:				true
};

// components
var components = {
	// Amount & Type
	textAmount: {
		type: 'number',
	},
	textType: {
		options: ['Words', 'Sentences', 'Paragraphs'],
		fullSize: true,
	},
	textStyle: {
		options: textStyleOptions,
		fullSize: true,
		onChange: function(value) {
			if(value == '') {
				var alert = Dialog.alert('Invalid Selection');
			}

			if (value != 'Lorem ipsum')
				components.bWithLatin.enabled = true;
			else
				components.bWithLatin.enabled = false;
			
			if (value == 'Kant' || value == 'Husserl' || value == 'Thanks') {
				components.textAmount.enabled = false;
				components.textType.enabled = false;
				components.bWithLatin.enabled = false;
				components.bTitle.enabled = false;
				components.bPunctuation.enabled = false;
			}
			else {
				components.textAmount.enabled = true;
				components.textType.enabled = true;
				components.bWithLatin.enabled = true;
				components.bTitle.enabled = true;
				components.bPunctuation.enabled = true;
			}

		}
	},
	bWithLatin: {
		type: 'checkbox',
		label: 'Include Latin',
		enabled: false,
		onChange: function(value) {
			if(value == false) values.bStartLorem = false;
		}
	},

	amountRule: {
		type: 'ruler',
		fullSize: true
	},


	// Details
	bTitle: {
		type: 'checkbox',
		label: 'Title Case',
		onChange: function(value) {
			if (value) components.bPunctuation.value = false;
		}
	},
	bPunctuation: {
		type: 'checkbox',
		label: 'Include Punctuation'
	},
	// bStartLorem: {
	// 	type: 'checkbox',
	// 	label: 'Start with \'Lorem ipsum\rdolor sit amet...\''
	// },

	detailRule: {
		type: 'ruler',
		fullSize: true,
	},


	// Replace
	bReplace: {
		type: 'checkbox',
		label: 'Replace existing text'
	},



	/**
	 *	the following elements are only visible/active
	 *	when using this tool in palette mode
	 */
	replaceRule: {
		type: 'ruler',
		fullSize: true,
		visible: values.bPalette
	},

	// ------------------------------------
	// Invocation
	// ------------------------------------
	submit: {
		type: 'button',
		value: 'Generate',
		fullSize: true,
		visible: values.bPalette,
		onClick: function() {
			Draw();
		}
	}

}


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	Translate('hello dog', 'it');
	
	
	// initialize the palette box
	if (values.bPalette) {
		palette = new Palette('Lorem Ipsum', components, values);
	}
	else {
		palette = new Dialog.prompt('Lorem Ipsum', components, values);
		Draw();
	}
}



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {}



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------


function Draw() {
	// selection
	sel = activeDocument.getItems({
		type: 'TextItem',
		selected: true
	});


	// choose generation style
	var wordList;

	var xml;
	var pythonCmd;
	var delim;

	if (values.textStyle == 'Kant' || values.textStyle == 'Husserl' || values.textStyle == 'Thanks') {
		if (values.textStyle == 'Binary') xml = binary;
		else if (values.textStyle == 'Husserl') xml = husserl;
		else if (values.textStyle == 'Kant') xml = kant;
		else if (values.textStyle == 'Thanks') xml = thanks;
		pythonCmd = script.directory + '/kant/kgp.py -g ' + script.directory + xml;
		delim = '\r';
	}
	else {
		if (values.textStyle == 'Hipster ipsum') {
			wordList = hipster;
			textStart = InitialCap(hipster[0]) + ipsumdolor;
		}
		else if (values.textStyle == 'Suomi ipsum') {
			wordList = suomi;
			textStart = InitialCap(suomi[0]) + ipsumdolor;
		}
		else if (values.textStyle == 'Bairisch ipsum') {
			wordList = bairisch;
			textStart = InitialCap(bairisch[0]) + ipsumdolor;
		}
		else if (values.textStyle == 'Veggie ipsum') {
			wordList = veggie;
			textStart = InitialCap(veggie[0]) + ipsumdolor;
		}
		else if (values.textStyle == 'Bacon ipsum') {
			wordList = bacon;
			textStart = InitialCap(bacon[0]) + ipsumdolor;
		}
		else if (values.textStyle == 'Jive ipsum') {
			wordList = jive;
			textStart = InitialCap(jive[0]) + ipsumdolor;
		}
		else {
			wordList = lorem;
			textStart = InitialCap(lorem[0]) + ipsumdolor;
		}
	}


	// generate text
	var text;
	var obj;
	if (sel.length > 0) {
		for ( var i=0; i<sel.length; i++ ) {
			obj = sel[i];
		
			if (values.textStyle == 'Kant' || values.textStyle == 'Husserl' || values.textStyle == 'Thanks')
				text = ExecPython(pythonCmd, delim);
			else
				text = GenerateText(wordList);
			if(obj.children.length > 1) Recursive(obj, text);
			else CreateTextItem(obj, text);
		}
	}
	else {
		if (values.textStyle == 'Kant' || values.textStyle == 'Husserl' || values.textStyle == 'Thanks')
			text = ExecPython(pythonCmd, delim);
		else
			text = GenerateText(wordList);
		CreateTextItem(obj, text);
	}
}



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function random(minr, maxr) {
	return minr + Math.random() * (maxr - minr);
}

function randomInt(minr, maxr) {
	return parseInt(random(minr, maxr));
}


// ------------------------------------------------------------------------
function merge(arr1, arr2) {
	var output = arr1.concat(arr2);
	output.shuffle();
	return output;
}


/**
 *
 *	http://jsfromhell.com/array/shuffle
 *	http://www.brain4.de/programmierecke/js/arrayShuffle.php
 *
 */
Array.prototype.shuffle = function() {
	for (var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
};


// ------------------------------------------------------------------------
function rtrim(str) {
	for (var i=str.length-1; str.charAt(i) ==' '; i--) {
		str = str.substring(0, i);
	}
	return str;
}
function trim(str) {
	str = str.replace(/(^\s*)|(\s*$)/gi,"");
	str = str.replace(/[ ]{2,}/gi," ");
	str = str.replace(/\n /,"\n");
	return str;
}


/**
 *
 *	with a little guidance from
 *	http://www.tek-tips.com/viewthread.cfm?qid=1227066&page=1
 *
 */
function InitialCap(str) {
	str = str.substr(0, 1).toUpperCase() + str.substr(1);
	return str;
}


/**
 *
 *	http://www.webdeveloper.com/forum/showthread.php?t=41676
 *	http://www.pit-r.de/
 *
 */
function SentenceCase(text) {
	val = text;
	// result = new Array();
	output = '';
	count = 0;

	endSentence = new Array();
	for (var i = 1; i < val.length; i++) {
		if (val.charAt(i) == '.' || val.charAt(i) == '!' || val.charAt(i) == '?') {
			endSentence[count] = val.charAt(i);
			count++
		}
	}

	var val2 = val.split(/[.|?|!]/);
	if (val2[val2.length - 1] == '') val2.length = val2.length - 1;

	for (var j = 0; j < val2.length; j++) {
		val3 = val2[j];
		if (val3.substring(0, 1) != ' ') val2[j] = ' ' + val2[j];
		var temp = val2[j].split(' ');
		var incr = 0;
		if (temp[0] == '') {
			incr = 1;
		}

		temp2 = temp[incr].substring(0, 1);
		temp3 = temp[incr].substring(1, temp[incr].length);
		temp2 = temp2.toUpperCase();
		temp3 = temp3.toLowerCase();
		temp[incr] = temp2 + temp3;

		for (var i = incr + 1; i < temp.length; i++) {
			temp2 = temp[i].substring(0, 1);
			temp2 = temp2.toLowerCase();
			temp3 = temp[i].substring(1, temp[i].length);
			temp3 = temp3.toLowerCase();
			temp[i] = temp2 + temp3;
		}

		if (endSentence[j] == undefined) endSentence[j] = '';
		output += temp.join(' ') + endSentence[j];
	}

	if (output.substring(0, 1) == ' ') output = output.substring(1, output.length);

	return output;
}

/*
 *
 */
function TitleCase(text) {
}






// ------------------------------------------------------------------------
/**
 *
 *	Lorem Ipsum generation methods
 *
 */

function Words(wordList, i) {
	var word = '';
	var length = values.textAmount;
	var bComma = length >= 7;
	var bColon = false; //length >= 14;
	var bSemicolon = length >= 14;
	var bEmDash = length >= 14;

	var source;
	if (wordList[0] != 'lorem' && values.bWithLatin) source = merge(wordList, lorem);
	else source = source = merge(wordList, new Array());

	var w = source[i];
	if(values.bTitle) w = InitialCap(w);

	if (i >= 3 && i != length - 1 && values.bPunctuation) {
		if (randomInt(0, 9) == 1 && bComma) {
			word = rtrim(word) + ', ';
			bComma = false;
		}
		else if (randomInt(0, 18) == 1 && bColon) {
			word = rtrim(word) + ': ';
			bColon = false;
		}
		else if (randomInt(0, 18) == 1 && bSemicolon) {
			word = rtrim(word) + '; ';
			bSemicolon = false;
		}
		else if (randomInt(0, 36) == 1 && bEmDash) {
			word = rtrim(word) + ' ' + String.fromCharCode(8212) + ' ';
			bEmDash = false;
		}
		else {
			word += ' ';
		}
	}
	else {
		word += ' ';
	}
	word += w;

	return word;
}


function Sentences(wordList, length) {
	var sentence = '';
	if( length === undefined ) length = randomInt(4, values.sentenceLengthAvg);
	var bPeriod = true;
	var bQuestion = true;
	var bExclamation = true;
	
	for (var i = 0; i < length; i++) {
		var word = Words(wordList, i);
		if(values.bTitle) word = InitialCap(word);
		sentence += word;
	}
	sentence = trim(sentence);
	if (randomInt(0, 36) == 1 && bQuestion) {
		sentence += '? ';
		bQuestion = false;
	}
	else if (randomInt(0, 36) == 1 && bExclamation) {
		sentence += '! ';
		bExclamation = false;
	}
	else {
		sentence += '. ';
	}

	if(!values.bTitle) sentence = SentenceCase(sentence);

	return sentence;
}


function Paragraphs(wordList) {
	var paragraph = '';
	var length = randomInt(
		values.paragraphSentenceAvg - values.paragraphLengthRange,
		values.paragraphSentenceAvg + values.paragraphLengthRange
	);

	for (i = 0; i < length; i++) paragraph += Sentences(wordList);
	paragraph += '\r\r';

	return paragraph;
}


function GenerateText(wordList) {
	var output = '';

	if (values.textType == 'Words') {
		text = Sentences(wordList, values.textAmount);
		output += text;
	}
	else {
		var i = 0;
		for (i = 0; i < values.textAmount; i++) {
			var text;
			if (values.textType == 'Sentences') {
				text = Sentences(wordList);
			}
			else {
				text = Paragraphs(wordList);
			}
			output += text;
		}
	}

	if (values.bStartLorem && output.length > 0) {
		// output.toLowerCase();
		output = textStart + output;
	}

	return output;
}


/**
 *
 * "Class" to execute and return the results of a python script
 * 
 */
function ExecPython(pythonCmd, delimitter) {
	var process = java.lang.Runtime.getRuntime().exec( 'python ' + pythonCmd );
	var pythonResult = '';
	var pythonResultArr = new Array();

	if(delimitter == '\r') delimitter = '\r\r';

	if(pythonCmd != '') {
		var reader = java.io.BufferedReader( java.io.InputStreamReader(process.getInputStream()) );

		while ( (line = reader.readLine()) != null ) {
			var m = String.split(line, delimitter);
			for(var i=0; i<m.length; i++) {
				pythonResultArr.push(pythonResultArr, m[i]);
			} 
			pythonResult += delimitter + trim(line);
		}
	}
	else {
		console.log('Not a valid python command/script');
	}

	return trim(pythonResult);
}

function CheckForKant() {
	var file = new File(script.file.parent, 'kant/kgp.py');
	if (file.exists()) {
		return new Array('Lorem ipsum', 'Suomi ipsum', 'Bairisch ipsum', 'Veggie ipsum', 'Bacon ipsum', 'Hipster ipsum', 'Jive ipsum', '', 'Kant', 'Husserl', 'Thanks');
	}
	else {
		return new Array('Lorem ipsum', 'Suomi ipsum', 'Bairisch ipsum', 'Veggie ipsum', 'Bacon ipsum', 'Hipster ipsum', 'Jive ipsum');
	}
}

// ------------------------------------------------------------------------
function CreateTextItem(obj, text) {
	if( obj != undefined ) {
		if(obj.words) {
			if(values.bReplace) obj.content = text;
			else obj.content += ' ' + text;
		}
	}
	else {
		var rectangle = new Rectangle(new Point(0,0), new Size(210,297));
		var areaText = new AreaText(rectangle);
		areaText.position = new Point(activeDocument.bounds.width*0.5, activeDocument.bounds.height*0.5);
		areaText.content += text;
	}
}


// ------------------------------------------------------------------------
function Translate(text, language) {
	// 'http://mymemory.translated.net/api/get?q=hello world&langpair=en|it&of=json&key=fkpXz3R5Vs4FU&de=ken.frederick@gmx.de'
	var url = new URL('http://mymemory.translated.net/api/get?q=hello dog!&langpair=en|it&of=json&de=ken.frederick@gmx.de');

	// var url = new URL(
	// 	'http://mymemory.translated.net/api/'+
	// 	'get?q=' + text  +
	// 	'&langpair=en|' + language +
	// 	'&of=json' +
	// 	// '&key=fkpXz3R5Vs4FU' +
	// 	'&de=ken.frederick@gmx.de'
	//     );
	var stream = new DataInputStream(url.openStream());
	var json = '';
	var line;
    while ((line = stream.readLine()) != null) {
        json += line;
    };
	print(stream);
    var data = Json.decode(json);
	print( data.responseStatus );
	print( data.matches[1] );
}


// ------------------------------------------------------------------------
function Recursive(obj, text) {
	for (var k = 0; k < obj.children.length; k++) {
		generateText( obj.children[k], text );
		// if(obj.children[k].children.length > 1) {
			Recursive( obj.children[k], text );
		// }
	}
}



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
//Draw();