//  (C) Copyright John Maddock 2006-8.
//  Use, modification and distribution are subject to the
//  Boost Software License, Version 1.0. (See accompanying file
//  LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)

#ifndef BOOST_MATH_NTL_DIGAMMA
#define BOOST_MATH_NTL_DIGAMMA

#include <boost/math/tools/rational.hpp>
#include <boost/math/tools/config.hpp>
#include <boost/math/policies/error_handling.hpp>
#include <boost/math/constants/constants.hpp>
#include <boost/math/tools/big_constant.hpp>

namespace boost{ namespace math{ namespace detail{

template <class T>
T big_digamma_helper(T x)
{
      static const T P[61] = {
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.6660133691143982067148122682345055274952e81),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.6365271516829242456324234577164675383137e81),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.2991038873096202943405966144203628966976e81),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.9211116495503170498076013367421231351115e80),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.2090792764676090716286400360584443891749e80),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.3730037777359591428226035156377978092809e79),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.5446396536956682043376492370432031543834e78),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.6692523966335177847425047827449069256345e77),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.7062543624100864681625612653756619116848e76),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.6499914905966283735005256964443226879158e75),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.5280364564853225211197557708655426736091e74),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.3823205608981176913075543599005095206953e73),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.2486733714214237704739129972671154532415e72),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1462562139602039577983434547171318011675e71),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.7821169065036815012381267259559910324285e69),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.3820552182348155468636157988764435365078e68),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1711618296983598244658239925535632505062e67),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.7056661618357643731419080738521475204245e65),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.2685246896473614017356264531791459936036e64),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.9455168125599643085283071944864977592391e62),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.3087541626972538362237309145177486236219e61),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.9367928873352980208052601301625005737407e59),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.2645306130689794942883818547314327466007e58),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.6961815141171454309161007351079576190079e56),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1709637824471794552313802669803885946843e55),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.3921553258481531526663112728778759311158e53),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.8409006354449988687714450897575728228696e51),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1686755204461325935742097669030363344927e50),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.3166653542877070999007425197729038754254e48),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.5566029092358215049069560272835654229637e46),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.9161766287916328133080586672953875116242e44),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 1412317772330871298317974693514430627922000),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 20387991986727877473732570146112459874790),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 275557928713904105182512535678580359839.3),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 3485719851040516559072031256589598330.723),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 41247046743564028399938106707656877.40859),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 456274078125709314602601667471879.0147312),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 4714450683242899367025707077155.310613012),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 45453933537925041680009544258.75073849996),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 408437900487067278846361972.302331241052),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 3415719344386166273085838.705771571751035),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 26541502879185876562320.93134691487351145),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 191261415065918713661.1571433274648417668),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 1275349770108718421.645275944284937551702),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 7849171120971773.318910987434906905704272),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 44455946386549.80866460312682983576538056),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 230920362395.3198137186361608905136598046),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 1095700096.240863858624279930600654130254),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 4727085.467506050153744334085516289728134),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 18440.75118859447173303252421991479005424),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 64.62515887799460295677071749181651317052),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.201851568864688406206528472883512147547),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.0005565091674187978029138500039504078098143),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1338097668312907986354698683493366559613e-5),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.276308225077464312820179030238305271638e-8),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.4801582970473168520375942100071070575043e-11),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.6829184144212920949740376186058541800175e-14),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.7634080076358511276617829524639455399182e-17),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.6290035083727140966418512608156646142409e-20),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.339652245667538733044036638506893821352e-23),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.9017518064256388530773585529891677854909e-27)
      };
      static const T Q[61] = {
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1386831185456898357379390197203894063459e81),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.6467076379487574703291056110838151259438e81),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1394967823848615838336194279565285465161e82),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1872927317344192945218570366455046340458e82),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1772461045338946243584650759986310355937e82),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1267294892200258648315971144069595555118e82),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.7157764838362416821508872117623058626589e81),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.329447266909948668265277828268378274513e81),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1264376077317689779509250183194342571207e81),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.4118230304191980787640446056583623228873e80),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1154393529762694616405952270558316515261e80),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.281655612889423906125295485693696744275e79),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.6037483524928743102724159846414025482077e78),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1145927995397835468123576831800276999614e78),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1938624296151985600348534009382865995154e77),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.293980925856227626211879961219188406675e76),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.4015574518216966910319562902099567437832e75),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.4961475457509727343545565970423431880907e74),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.5565482348278933960215521991000378896338e73),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.5686112924615820754631098622770303094938e72),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.5305988545844796293285410303747469932856e71),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.4533363413802585060568537458067343491358e70),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.3553932059473516064068322757331575565718e69),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.2561198565218704414618802902533972354203e68),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1699519313292900324098102065697454295572e67),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1039830160862334505389615281373574959236e66),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.5873082967977428281000961954715372504986e64),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.3065255179030575882202133042549783442446e63),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1479494813481364701208655943688307245459e62),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.6608150467921598615495180659808895663164e60),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.2732535313770902021791888953487787496976e59),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1046402297662493314531194338414508049069e58),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.3711375077192882936085049147920021549622e56),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1219154482883895482637944309702972234576e55),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.3708359374149458741391374452286837880162e53),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1044095509971707189716913168889769471468e52),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.271951506225063286130946773813524945052e50),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.6548016291215163843464133978454065823866e48),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1456062447610542135403751730809295219344e47),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.2986690175077969760978388356833006028929e45),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 5643149706574013350061247429006443326844000),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 98047545414467090421964387960743688053480),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 1563378767746846395507385099301468978550),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 22823360528584500077862274918382796495),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 304215527004115213046601295970388750),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 3690289075895685793844344966820325),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 40584512015702371433911456606050),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 402834190897282802772754873905),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 3589522158493606918146495750),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 28530557707503483723634725),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 200714561335055753000730),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 1237953783437761888641),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 6614698701445762950),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 30155495647727505),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 114953256021450),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 356398020013),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 863113950),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 1531345),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 1770),
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 1)
      };
      static const T PD[60] = {
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.6365271516829242456324234577164675383137e81),
         2*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.2991038873096202943405966144203628966976e81),
         3*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.9211116495503170498076013367421231351115e80),
         4*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.2090792764676090716286400360584443891749e80),
         5*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.3730037777359591428226035156377978092809e79),
         6*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.5446396536956682043376492370432031543834e78),
         7*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.6692523966335177847425047827449069256345e77),
         8*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.7062543624100864681625612653756619116848e76),
         9*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.6499914905966283735005256964443226879158e75),
         10*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.5280364564853225211197557708655426736091e74),
         11*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.3823205608981176913075543599005095206953e73),
         12*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.2486733714214237704739129972671154532415e72),
         13*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1462562139602039577983434547171318011675e71),
         14*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.7821169065036815012381267259559910324285e69),
         15*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.3820552182348155468636157988764435365078e68),
         16*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1711618296983598244658239925535632505062e67),
         17*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.7056661618357643731419080738521475204245e65),
         18*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.2685246896473614017356264531791459936036e64),
         19*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.9455168125599643085283071944864977592391e62),
         20*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.3087541626972538362237309145177486236219e61),
         21*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.9367928873352980208052601301625005737407e59),
         22*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.2645306130689794942883818547314327466007e58),
         23*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.6961815141171454309161007351079576190079e56),
         24*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1709637824471794552313802669803885946843e55),
         25*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.3921553258481531526663112728778759311158e53),
         26*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.8409006354449988687714450897575728228696e51),
         27*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1686755204461325935742097669030363344927e50),
         28*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.3166653542877070999007425197729038754254e48),
         29*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.5566029092358215049069560272835654229637e46),
         30*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.9161766287916328133080586672953875116242e44),
         31*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 1412317772330871298317974693514430627922000),
         32*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 20387991986727877473732570146112459874790),
         33*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 275557928713904105182512535678580359839.3),
         34*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 3485719851040516559072031256589598330.723),
         35*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 41247046743564028399938106707656877.40859),
         36*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 456274078125709314602601667471879.0147312),
         37*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 4714450683242899367025707077155.310613012),
         38*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 45453933537925041680009544258.75073849996),
         39*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 408437900487067278846361972.302331241052),
         40*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 3415719344386166273085838.705771571751035),
         41*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 26541502879185876562320.93134691487351145),
         42*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 191261415065918713661.1571433274648417668),
         43*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 1275349770108718421.645275944284937551702),
         44*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 7849171120971773.318910987434906905704272),
         45*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 44455946386549.80866460312682983576538056),
         46*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 230920362395.3198137186361608905136598046),
         47*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 1095700096.240863858624279930600654130254),
         48*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 4727085.467506050153744334085516289728134),
         49*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 18440.75118859447173303252421991479005424),
         50*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 64.62515887799460295677071749181651317052),
         51*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.201851568864688406206528472883512147547),
         52*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.0005565091674187978029138500039504078098143),
         53*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1338097668312907986354698683493366559613e-5),
         54*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.276308225077464312820179030238305271638e-8),
         55*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.4801582970473168520375942100071070575043e-11),
         56*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.6829184144212920949740376186058541800175e-14),
         57*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.7634080076358511276617829524639455399182e-17),
         58*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.6290035083727140966418512608156646142409e-20),
         59*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.339652245667538733044036638506893821352e-23),
         60*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.9017518064256388530773585529891677854909e-27)
      };
      static const T QD[60] = {
         BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1386831185456898357379390197203894063459e81),
         2*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.6467076379487574703291056110838151259438e81),
         3*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1394967823848615838336194279565285465161e82),
         4*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1872927317344192945218570366455046340458e82),
         5*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1772461045338946243584650759986310355937e82),
         6*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1267294892200258648315971144069595555118e82),
         7*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.7157764838362416821508872117623058626589e81),
         8*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.329447266909948668265277828268378274513e81),
         9*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1264376077317689779509250183194342571207e81),
         10*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.4118230304191980787640446056583623228873e80),
         11*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1154393529762694616405952270558316515261e80),
         12*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.281655612889423906125295485693696744275e79),
         13*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.6037483524928743102724159846414025482077e78),
         14*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1145927995397835468123576831800276999614e78),
         15*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1938624296151985600348534009382865995154e77),
         16*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.293980925856227626211879961219188406675e76),
         17*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.4015574518216966910319562902099567437832e75),
         18*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.4961475457509727343545565970423431880907e74),
         19*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.5565482348278933960215521991000378896338e73),
         20*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.5686112924615820754631098622770303094938e72),
         21*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.5305988545844796293285410303747469932856e71),
         22*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.4533363413802585060568537458067343491358e70),
         23*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.3553932059473516064068322757331575565718e69),
         24*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.2561198565218704414618802902533972354203e68),
         25*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1699519313292900324098102065697454295572e67),
         26*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1039830160862334505389615281373574959236e66),
         27*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.5873082967977428281000961954715372504986e64),
         28*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.3065255179030575882202133042549783442446e63),
         29*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1479494813481364701208655943688307245459e62),
         30*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.6608150467921598615495180659808895663164e60),
         31*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.2732535313770902021791888953487787496976e59),
         32*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1046402297662493314531194338414508049069e58),
         33*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.3711375077192882936085049147920021549622e56),
         34*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1219154482883895482637944309702972234576e55),
         35*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.3708359374149458741391374452286837880162e53),
         36*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1044095509971707189716913168889769471468e52),
         37*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.271951506225063286130946773813524945052e50),
         38*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.6548016291215163843464133978454065823866e48),
         39*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.1456062447610542135403751730809295219344e47),
         40*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 0.2986690175077969760978388356833006028929e45),
         41*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 5643149706574013350061247429006443326844000),
         42*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 98047545414467090421964387960743688053480),
         43*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 1563378767746846395507385099301468978550),
         44*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 22823360528584500077862274918382796495),
         45*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 304215527004115213046601295970388750),
         46*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 3690289075895685793844344966820325),
         47*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 40584512015702371433911456606050),
         48*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 402834190897282802772754873905),
         49*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 3589522158493606918146495750),
         50*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 28530557707503483723634725),
         51*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 200714561335055753000730),
         52*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 1237953783437761888641),
         53*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 6614698701445762950),
         54*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 30155495647727505),
         55*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 114953256021450),
         56*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 356398020013),
         57*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 863113950),
         58*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 1531345),
         59*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 1770),
         60*BOOST_MATH_BIG_CONSTANT(T, boost::math::tools::numeric_traits<T>::digits, 1)
      };
   static const double g = 63.192152;

   T zgh = x + g - 0.5;

   T result = (x - 0.5) / zgh;
   result += log(zgh);
   result += tools::evaluate_polynomial(PD, x) / tools::evaluate_polynomial(P, x);
   result -= tools::evaluate_polynomial(QD, x) / tools::evaluate_polynomial(Q, x);
   result -= 1;

   return result;
}

template <class T>
T big_digamma(T x)
{
   BOOST_MATH_STD_USING

   if(x < 0)
   {
      return big_digamma_helper(static_cast<T>(1-x)) + constants::pi<T>() / tan(constants::pi<T>() * (1-x));
   }
   return big_digamma_helper(x);
}

}}}

#endif // include guard
