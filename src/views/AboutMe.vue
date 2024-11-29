<template>
    <div>
        <h1 class='mb-5 text-gold text-center header-font font-weight-bold'>
            <span class="text-red">Get</span> to know me &#128526;
        </h1>
    
        <!-- Horizontale scrollbare container voor foto's -->
        <div class="photo-gallery mt-4">
            <div v-for="photo in photos" :key="photo.id" class="photo-box">
                <img :src="photo.url" :alt="photo.title" class="photo-image" />
            </div>
        </div>
        
        <div class="tt text-center mt-4 text-white">
            <p>
                Hi, I’m <span class="text-red">28</span> years old, a passionate front-end developer with a creative mindset and a strong drive for self-improvement. 
                I excel at teamwork and thrive in solving complex problems by crafting innovative and tailored solutions.
            </p>
            <p>
                My journey into front-end development began when I sought new challenges, and I quickly fell in love with the creative and technical aspects of web development. 
                Over the past year, I have built expertise in both front-end and back-end technologies, including:
                <span class="text-red">&#x21A3;</span><span class="text-gold">HTML5</span> 
                <span class="text-red">&#x21A3;</span><span class="text-gold">CSS3</span> 
                <span class="text-red">&#x21A3;</span><span class="text-gold">JavaScript</span> 
                <span class="text-red">&#x21A3;</span><span class="text-gold">jQuery</span> 
                <span class="text-red">&#x21A3;</span><span class="text-gold">PHP</span> 
                <span class="text-red">&#x21A3;</span><span class="text-gold">MySQL</span> 
                <span class="text-red">&#x21A3;</span><span class="text-gold">Laravel</span> 
                <span class="text-red">&#x21A3;</span><span class="text-gold">Vue.js</span>.
            </p>
            <p>
                With these skills, I create end-to-end web applications that are both visually appealing and technically robust, managing everything from user interfaces to server-side logic and database design.
            </p>
            <p>
                I am currently working as a freelancer on various client projects, continually broadening my skill set and staying up-to-date with the latest technologies. 
                My approach combines creativity, problem-solving, and a commitment to delivering solutions that align with my clients’ goals. 
                Above all, I am dedicated to continuous learning, always seeking to enhance my abilities and push the boundaries of what I can achieve.
            </p>
        </div>
    </div>
</template>

<script>
import sanityClient from "@/sanityClient"; 

export default {
    name: 'AboutMe',
    data() {
        return {
            photos: [],
        };
    },
    created() {
        sanityClient
            .fetch(
                `*[_type == "aboutMePhotos"]{
                    title,
                    "url": image.asset->url
                }`
            )
            .then((data) => {
                this.photos = data;
            })
            .catch((error) => console.error(error));
    },
};
</script>

<style scoped>
.photo-gallery {
    display: flex;
    overflow-x: auto;
    gap: 16px;
    padding: 10px;
    scrollbar-width: thin;
}

.photo-gallery::-webkit-scrollbar {
    height: 1px;
}

.photo-gallery::-webkit-scrollbar-thumb {
    background: red;
    border-radius: 10px;
}

.photo-box {
    flex: 0 0 auto;
    width: 300px;
    height: 300px;
    border: 2px solid black;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
}

.photo-box:hover {
    transform: scale(1.05);
}

.photo-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Mobiele aanpassingen */
@media (max-width: 768px) {
  .photo-gallery {
    gap: 8px;
    padding: 5px;
  }

  .photo-box {
    width: 200px;
    height: 200px;
  }

  h1 {
    font-size: 1.5rem;
  }

  p {
    font-size: 0.9rem;
  }
}
</style>