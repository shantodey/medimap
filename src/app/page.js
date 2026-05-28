
import Navber from "./component/Common/Navber";
import EmergencyBanner from "./component/Home/EmergencyBanner";
import HeroSection from "./component/Home/HeroSection";
import OurServices from "./component/Home/OurServices";
import SymptomsSection from "./component/Home/SymptomsSection";

export default function Home() {
  return (
    <>
      <HeroSection/>
      <EmergencyBanner/>
      <SymptomsSection/>
      <OurServices/>
    </>
  );
}
