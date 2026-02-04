import { UserProfile } from "../models/UserProfile";


export const updateProfile = async(
    username:string | null, 
    fullName: string | null, 
    aboutMe:string | null, 
    socialLinks: string[] | null,
    userId: string
) =>{
    const user = await UserProfile.findByPk(userId);
    if(!user){  
        return null;
    }
    await user.update({username, fullName, aboutMe, socialLinks});
    return user;

};

export const getProfile = async (userId: string) => {
  const user = await UserProfile.findByPk(userId, {
    attributes: [
      "username",
      "fullName",
      "aboutMe",
      "socialLinks",
      "urlAvatar" // si quieres el avatar
    ]
  });

  if (!user) return null;

// Transformar a objeto plano y parsear socialLinks
  return {
    username: user.username,
    fullName: user.fullName,
    aboutMe: user.aboutMe,
    urlAvatar: user.urlAvatar,
    socialLinks: user.socialLinks ? (typeof user.socialLinks === 'string' ? JSON.parse(user.socialLinks) : user.socialLinks) : {}
  };
};


export const updateAvatar = async (userId: string, urlAvatar: string) => {
     try {
    const user = await UserProfile.findByPk(userId);

    if (!user) {
      return null;
    }

    user.urlAvatar = urlAvatar; // 🔹 actualiza el campo
    await user.save(); // 🔹 guarda los cambios

    return user;
  } catch (error) {
    console.error("❌ Error al actualizar el avatar:", error);
    throw new Error("No se pudo actualizar el avatar");
  }
}


export const getPublicProfile= async(username: string) =>{
  const user = await UserProfile.findOne({
        where: {username},
        attributes:['username', 'fullName', 'aboutMe', 'urlAvatar', 'socialLinks'],
    });
    if(!user){
        return null;
    }
    return {
        username: user.username,
        fullName: user.fullName,
        aboutMe: user.aboutMe,
        urlAvatar: user.urlAvatar,
        socialLinks: user.socialLinks ? 
        (typeof user.socialLinks === 'string' ? JSON.parse(user.socialLinks) : user.socialLinks) : {}
    }
}

