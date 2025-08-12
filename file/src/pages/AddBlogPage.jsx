import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddBlogLayer from "../components/AddBlogLayer";
import BlogManager from "../components/BlogManager";

const AddBlogPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Blog Details' />

        {/* AddBlogLayer */}
        <BlogManager/>
      </MasterLayout>
    </>
  );
};

export default AddBlogPage;
