//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Data
{
    using System;
    using System.Collections.Generic;
    
    public partial class IndicatorValue
    {
        public int IndicatorId { get; set; }
        public int TimePointId { get; set; }
        public decimal Value { get; set; }
    
        public virtual Indicator Indicator { get; set; }
        public virtual TimePoint TimePoint { get; set; }
    }
}
