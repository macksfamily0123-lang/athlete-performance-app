"use client";

import React from "react";

type Props={
  children:React.ReactNode;
  onReport?:(details:string)=>void;
};

type State={
  error:Error|null;
  details:string;
};

export default class BetaErrorBoundary extends React.Component<Props,State>{
  state:State={error:null,details:""};

  static getDerivedStateFromError(error:Error):State{
    return {error,details:""};
  }

  componentDidCatch(error:Error,info:React.ErrorInfo){
    const details=[
      `Runtime error: ${error.name}: ${error.message}`,
      info.componentStack?`Component stack:${info.componentStack}`:""
    ].filter(Boolean).join("\n");
    this.setState({details});
  }

  private reload=()=>{
    window.location.reload();
  };

  private report=()=>{
    const text=this.state.details||(
      this.state.error
        ?`Runtime error: ${this.state.error.name}: ${this.state.error.message}`
        :"Runtime error"
    );
    this.props.onReport?.(text);
  };

  render(){
    if(!this.state.error)return this.props.children;

    return <div className="betaCrashShell">
      <div className="betaCrashCard">
        <span className="tag">BETA RECOVERY</span>
        <h1>Something went wrong</h1>
        <p>The beta app hit an unexpected screen error. Your saved cloud data is not deleted by this message.</p>
        <div className="betaCrashActions">
          <button className="betaPrimary" onClick={this.reload}>Reload App</button>
          {this.props.onReport&&<button onClick={this.report}>Report This Error</button>}
        </div>
        <details>
          <summary>Technical details</summary>
          <pre>{this.state.error.name}: {this.state.error.message}</pre>
        </details>
      </div>
    </div>;
  }
}
