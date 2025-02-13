

export function generateSlug(name: string, unique: boolean = false){

    let slug= name.toLowerCase().replace(/ /g, '-');

    if(unique){
        let uniqueNumber = Math.floor(Math.random() * 1000);
        slug = slug + '-' + uniqueNumber;
    }
    
    return slug;
}