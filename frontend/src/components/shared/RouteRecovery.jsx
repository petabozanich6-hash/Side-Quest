import React from "react";
// Do not automatically reload or clear offline work when a deployment/network interrupts loading.
export default class RouteRecovery extends React.Component {
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 render(){if(!this.state.failed)return this.props.children;return <section className="paper-card m-4 sm:m-8 p-6 max-w-xl space-y-3" role="alert"><h2 className="font-display text-xl font-bold text-emerald-950">This page couldn't open</h2><p className="text-sm text-stone-700">Check your connection and try again. If you have unsaved work elsewhere, save it before refreshing.</p><button type="button" className="rounded-full bg-emerald-950 text-white px-5 py-2 font-bold" onClick={()=>window.location.reload()}>Reload page</button></section>;}
}
