const TransversalHeader = ({
  title = "Transversal Header",
  description = "Esta es una cabecera transversal que se muestra en todas las páginas",
  classNameAdd = ""
}) => {
  return (
    <>
      <div className={`flex flex-col w-full md:w-3/4 mt-4 md:mt-8 gap-2 mx-auto justify-start py-2 px-6 md:p-0 ${classNameAdd}`}>
        <h1 className="text-2xl font-bold text-gray-800 w-full">{title}</h1>
        <p className="text-gray-600 w-full">{description}</p>
        <div className="w-full h-1 bg-gray-100 mt-2"></div>
      </div>
    </>
  );
};

export default TransversalHeader;
