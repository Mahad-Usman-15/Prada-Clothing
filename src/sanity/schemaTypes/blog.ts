export const blogschema={
    
        name:"blog",
        title:"Blog Data",
        type:"document",
        fields:[
            {
                name:"blogTitle",
                title:"Blog Title",
                type:'string'
            },
            {
                name:"blogDescription",
                title:"Blog Description",
                type:'string'
            },
            {
                name:"slug",
                title:"Slug",
                type:'slug',
                options:{
        source:'blogTitle'
      }
            },
            {
      name: 'image',
      title: 'Image',
      type: 'image', // Using Sanity's image type for image field
      options: {
        hotspot: true,
      },
    },
        ]
    
}
