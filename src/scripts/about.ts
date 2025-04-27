import imgURL from "../../public/assets/vismay.png?url";
import resumeURL from "../../public/assets/resume.pdf?url";

export function initAbout(): void {
  const about = document.getElementById("about");
  if (!about) return;

  const name = "Vismay Vakharia";

  about.innerHTML = `
    <div class="container mx-auto px-6 flex flex-col md:flex-row items-center">
      <div class="md:w-1/2 flex justify-center mb-10 md:mb-0">
        <div class="relative">
          <div class="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-indigo-500 shadow-xl">
            <img src="${imgURL}" alt="${name}" class="w-full h-full object-cover" />
          </div>
          <div
            class="absolute -bottom-4 -right-4 bg-indigo-400 dark:bg-indigo-600 text-black dark:text-white px-4 py-2 rounded-lg shadow-lg">
            <span class="font-semibold">Robotics Researcher</span>
          </div>
        </div>
      </div>

      <div class="md:w-1/2 md:pl-12">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Hi, I'm <span
            class="bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-600 dark:to-indigo-400 bg-clip-text text-transparent">${name}</span>
        </h1>
        <p class="text-xl text-gray-700 dark:text-gray-300 mb-6">Robotics Enthusiast, Researcher & Engineer</p>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          I'm Vismay Vakharia, a Bengaluru-based robotics researcher with a background in Computer Science (Georgia Tech) and Mechanical Engineering (IIT Gandhinagar). I specialize in robotics, autonomous systems, and AI-driven solutions, blending motion planning, machine learning, and control systems.
        </p>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          At Tata Consultancy Services Research, I lead the development of cutting-edge robotics, including omni-directional mobile robots and 5G-enabled teleoperation frameworks. My work has gained global recognition at competitions like the ANA Avatar XPRIZE and MBZIRC 2020.
        </p>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          Currently, I work at Tata Consultancy Services Research, where I've led the development of advanced robotics solutions, such as omni-directional mobile robots and teleoperation frameworks integrated with 5G networks. My work has earned recognition at global competitions, including the ANA Avatar XPRIZE and the Mohamed Bin Zayed International Robotics Challenge (MBZIRC-2020).
        </p>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          With experience across academia and industry—including a research stint at Texas A&M—I design intelligent systems for robotic manipulation, navigation, and task planning. I'm proficient in Python, C++, ROS, TensorFlow, PyTorch, and simulation tools like Gazebo and MATLAB. I thrive at the intersection of software and hardware, solving complex problems and building future-ready automation.
        </p>
        <div class="flex space-x-4">
          <a href="https://github.com/VismayVakharia/" target="_blank" rel="noopener noreferrer"
            class="social-link text-2xl text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
            <i class="fab fa-github"></i>
          </a>
          <a href="https://www.linkedin.com/in/vismay-vakharia/" target="_blank" rel="noopener noreferrer"
            class="social-link text-2xl text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
            <i class="fab fa-linkedin"></i>
          </a>
          <a href="https://scholar.google.com/citations?hl=en&user=Owl4GugAAAAJ" target="_blank" rel="noopener noreferrer"
            class="social-link text-2xl text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
            <i class="fas fa-graduation-cap"></i>
          </a>
          <a href="https://orcid.org/0009-0001-3400-5534" target="_blank" rel="noopener noreferrer"
            class="social-link text-2xl text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
            <i class="fas fa-brands fa-orcid"></i>
          </a>
        </div>

        <div class="flex mt-8 space-x-4">
          <a href="#contact"
            class="bg-indigo-400 dark:bg-indigo-600 hover:bg-indigo-300 dark:hover:bg-indigo-700 text-black dark:text-white px-6 py-3 rounded-lg transition-colors duration-300 flex items-center">
            <i class="fas fa-envelope mr-2"></i> Contact Me
          </a>
          <a href="${resumeURL}" target="_blank"
            class="border border-indigo-400 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-400 dark:hover:bg-indigo-600 hover:text-black dark:hover:text-white px-6 py-3 rounded-lg transition-colors duration-300 flex items-center">
            <i class="fas fa-download mr-2"></i> Download CV
          </a>
        </div>
      </div>
    </div>
    `;
}
