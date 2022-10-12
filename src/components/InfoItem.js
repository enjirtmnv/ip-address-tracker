import React from 'react';

const InfoItem = ({name, info}) => {
    return (
        <div className="lg:border-r last:border-none lg:border-slate-400 pr-8">
            <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">{name}</h2>
            <p className="font-bold text-slate-900 text-lg md:text-xl xl:text-2xl">{info}</p>
        </div>  
    )
};

export default InfoItem;
