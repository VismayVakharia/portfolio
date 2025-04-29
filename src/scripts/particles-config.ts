import type { ILoadParams } from "@tsparticles/engine";

export const particlesConfig: ILoadParams = {
  id: "tsparticles",
  options: {
    fullScreen: {
      enable: true,
      zIndex: -1,
    },
    detectRetina: true,
    fpsLimit: 60,
    interactivity: {
      detectsOn: "window",
      events: {
        onHover: {
          enable: true,
          mode: "grab",
          parallax: {
            enable: true,
            force: 60,
            smooth: 10,
          },
        },
        onClick: {
          enable: false,
          mode: "push",
        },
        resize: {
          enable: true,
        },
      },
      modes: {
        grab: {
          distance: 200,
          links: {
            opacity: 1,
          },
        },
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
          factor: 100,
          speed: 1,
          maxSpeed: 50,
          easing: "ease-out-quad",
          divs: {
            distance: 200,
            duration: 0.4,
            factor: 100,
            speed: 1,
            maxSpeed: 50,
            easing: "ease-out-quad",
          },
        },
      },
    },
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
        },
      },
      color: {
        value: "#4f46e5",
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: {
          min: 0.1,
          max: 0.5,
        },
        animation: {
          enable: true,
          speed: 1,
          startValue: "random",
          sync: false,
        },
      },
      size: {
        value: {
          min: 1,
          max: 3,
        },
        animation: {
          enable: true,
          speed: 2,
          startValue: "random",
          sync: false,
        },
      },
      links: {
        enable: true,
        distance: 150,
        color: "#6366f1",
        opacity: 0.4,
        width: 1,
        triangles: {
          enable: true,
          opacity: 0.05,
        },
      },
      move: {
        enable: true,
        speed: 3,
        direction: "none",
        random: false,
        straight: false,
        outModes: {
          default: "out",
        },
        attract: {
          enable: false,
          rotate: {
            x: 600,
            y: 1200,
          },
        },
      },
    },
  },
};
